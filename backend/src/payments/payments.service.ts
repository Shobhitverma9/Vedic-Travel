import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Booking, BookingDocument, PaymentStatus } from '../bookings/schemas/booking.schema';
import { BookingsService } from '../bookings/bookings.service';
import { EmailService } from '../email/email.service';
import { InvoiceService } from '../email/invoice.service';
import { WhatsappService } from '../notifications/whatsapp.service';

@Injectable()
export class PaymentsService {
    private merchantKey: string;
    private merchantSalt: string;
    private payuBaseUrl: string;
    private successUrl: string;
    private failureUrl: string;

    constructor(
        private configService: ConfigService,
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private bookingsService: BookingsService,
        private emailService: EmailService,
        private invoiceService: InvoiceService,
        private whatsappService: WhatsappService,
    ) {
        this.merchantKey = this.configService.get<string>('PAYU_MERCHANT_KEY');
        this.merchantSalt = this.configService.get<string>('PAYU_MERCHANT_SALT');
        this.payuBaseUrl = this.configService.get<string>('PAYU_BASE_URL');
        this.successUrl = this.configService.get<string>('PAYU_SUCCESS_URL');
        this.failureUrl = this.configService.get<string>('PAYU_FAILURE_URL');
    }



    async getEmiOptions(amount: number) {
        if (!this.merchantKey || !this.merchantSalt) {
            console.warn('PayU credentials missing, using fallback EMI calculation');
            return this.getFallbackEmiOptions(amount);
        }

        const command = 'getEmiAmountAccordingToInterest';
        const hash = crypto.createHash('sha512')
            .update(`${this.merchantKey}|${command}|${amount}|${this.merchantSalt}`)
            .digest('hex');

        const formData = new URLSearchParams();
        formData.append('key', this.merchantKey);
        formData.append('command', command);
        formData.append('var1', Math.round(amount).toString());
        formData.append('hash', hash);

        try {
            // PayU Post Service URL
            const postServiceUrl = this.payuBaseUrl?.includes('test')
                ? 'https://test.payu.in/merchant/postservice.php?form=2'
                : 'https://info.payu.in/merchant/postservice.php?form=2';

            const response = await fetch(postServiceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`PayU PostService responded with ${response.status}`);
            }

            const data = await response.json() as any;

            if (data.status !== 1 || !data.result) {
                console.warn('PayU EMI API returned non-success status:', data.msg || 'Unknown error');
                return this.getFallbackEmiOptions(amount);
            }

            return this.mapPayUResponseToEMIInfo(data.result, amount);
        } catch (error) {
            console.error('Error fetching EMI options from PayU:', error);
            return this.getFallbackEmiOptions(amount);
        }
    }

    private mapPayUResponseToEMIInfo(result: any, amount: number) {
        const bankWisePlans: any[] = [];
        
        // PayU response can be in different formats depending on account setup
        const emiData = result.emi_details || result;

        if (Array.isArray(emiData)) {
            // Group by bank
            const grouped = emiData.reduce((acc: any, item: any) => {
                const bankName = item.bank_name || 'Bank';
                if (!acc[bankName]) acc[bankName] = [];
                acc[bankName].push({
                    tenure: parseInt(item.tenure),
                    interestRate: parseFloat(item.interest_rate),
                    emi: Math.round(parseFloat(item.emi_amount)),
                    totalAmount: Math.round(parseFloat(item.total_amount))
                });
                return acc;
            }, {});

            Object.keys(grouped).forEach(bank => {
                bankWisePlans.push({
                    bank,
                    plans: grouped[bank].sort((a: any, b: any) => a.tenure - b.tenure)
                });
            });
        } else if (typeof emiData === 'object' && emiData !== null) {
            Object.keys(emiData).forEach(bank => {
                const rawPlans = emiData[bank];
                if (Array.isArray(rawPlans)) {
                    const plans = rawPlans.map((p: any) => ({
                        tenure: parseInt(p.tenure),
                        interestRate: parseFloat(p.interest_rate),
                        emi: Math.round(parseFloat(p.emi_amount)),
                        totalAmount: Math.round(parseFloat(p.total_amount))
                    }));
                    
                    if (plans.length > 0) {
                        bankWisePlans.push({
                            bank,
                            plans: plans.sort((a: any, b: any) => a.tenure - b.tenure)
                        });
                    }
                }
            });
        }

        if (bankWisePlans.length === 0) {
            return this.getFallbackEmiOptions(amount);
        }

        // Sort banks alphabetically
        bankWisePlans.sort((a, b) => a.bank.localeCompare(b.bank));

        const allPlans = bankWisePlans.flatMap(bp => bp.plans.map((p: any) => ({ ...p, bank: bp.bank })));
        const lowestEmi = Math.min(...allPlans.map((p: any) => p.emi));

        return {
            lowestEmi,
            bankWisePlans,
            allPlans: allPlans.sort((a: any, b: any) => a.tenure - b.tenure)
        };
    }

    private getFallbackEmiOptions(amount: number) {
        // Mock EMI options from major banks as fallback
        const banks = [
            { name: 'HDFC Bank', interestRate: 13.5 },
            { name: 'ICICI Bank', interestRate: 14 },
            { name: 'SBI', interestRate: 13 },
            { name: 'Axis Bank', interestRate: 14.5 }
        ];

        const tenures = [3, 6, 9, 12];

        const bankPlans = banks.map(bank => {
            const plans = tenures.map(month => {
                const monthlyInterest = (bank.interestRate / 12) / 100;
                const emi = amount * monthlyInterest * Math.pow(1 + monthlyInterest, month) / (Math.pow(1 + monthlyInterest, month) - 1);
                return {
                    tenure: month,
                    interestRate: bank.interestRate,
                    emi: Math.round(emi),
                    totalAmount: Math.round(emi * month),
                };
            });
            return {
                bank: bank.name,
                plans
            };
        });

        const allPlans = bankPlans.flatMap(bp => bp.plans.map(p => ({ ...p, bank: bp.bank })));
        const lowestEmi = Math.min(...allPlans.map(p => p.emi));

        return {
            lowestEmi,
            bankWisePlans: bankPlans,
            allPlans: allPlans.sort((a, b) => a.tenure - b.tenure)
        };
    }

    async initiatePayment(bookingId: string, userId?: string) {
        const query: any = { _id: bookingId };
        if (userId) {
            query.user = userId;
        }

        const booking = await this.bookingModel.findOne(query).populate('user');

        if (!booking) {
            throw new BadRequestException('Booking not found');
        }

        if (booking.paymentStatus === PaymentStatus.SUCCESS) {
            throw new BadRequestException('Payment already completed');
        }

        let txnid = booking.payuTransactionId;
        if (!txnid) {
            txnid = this.generateTransactionId();
            // Save the transaction ID immediately for reliability and reconciliation
            await this.bookingModel.findByIdAndUpdate(bookingId, { payuTransactionId: txnid });
        }

        const amount = booking.totalAmount.toFixed(2);
        const productinfo = `Tour Booking - ${booking.bookingReference}`;

        // Handle guest vs logged-in user — Prioritize communication email given at checkout
        let firstname = '';
        let email = booking.email || '';
        let phone = booking.phone || '';

        if (booking.user && !email) {
            email = (booking.user as any).email;
            phone = phone || (booking.user as any).phone || '';
        }

        if (booking.user) {
            firstname = (booking.user as any).name;
        } else {
            firstname = (booking as any).billingAddress?.firstName || (booking as any).travelerDetails?.[0]?.name || 'Guest';
        }

        // Generate hash — must match: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
        const hash = this.generatePayUHash(
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            bookingId, // udf1
        );

        return {
            paymentUrl: this.payuBaseUrl, // Should be https://test.payu.in/_payment for test or https://secure.payu.in/_payment for prod
            paymentData: {
                key: this.merchantKey,
                txnid,
                amount,
                productinfo,
                firstname,
                email,
                phone,
                surl: this.successUrl,
                furl: this.failureUrl,
                hash,
                udf1: bookingId,
                udf2: '',
                udf3: '',
                udf4: '',
                udf5: '',
            },
        };
    }

    async verifyPayment(paymentData: any) {
        const {
            status,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            mihpayid,
            udf1: bookingId,
            hash: receivedHash,
        } = paymentData;

        // Verify hash for security
        const calculatedHash = this.generatePayUResponseHash(
            status,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            bookingId
        );

        if (calculatedHash !== receivedHash) {
            console.warn(`Hash mismatch for booking ${bookingId}. Received: ${receivedHash}, Calculated: ${calculatedHash}`);
            throw new BadRequestException('Invalid payment hash');
        }

        // Update booking payment status
        if (status === 'success') {
            const updatedBooking = await this.bookingsService.updatePaymentStatus(
                bookingId,
                PaymentStatus.SUCCESS,
                mihpayid,
                txnid,
            );

            // Send booking confirmation email
            try {
                const tour = (updatedBooking as any).tour;
                const recipientEmail = email || (updatedBooking as any).email || (updatedBooking as any).user?.email || '';
                const billingName = (updatedBooking as any).billingAddress ? `${(updatedBooking as any).billingAddress.firstName} ${(updatedBooking as any).billingAddress.lastName}` : '';
                const recipientName = billingName || firstname || (updatedBooking as any).user?.name || (updatedBooking as any).travelerDetails?.[0]?.name || 'Valued Guest';
                const recipientPhone = (updatedBooking as any).phone || (updatedBooking as any).user?.phone || '';

                if (recipientEmail) {
                    await this.emailService.sendBookingConfirmationEmail(
                        recipientEmail,
                        recipientName,
                        {
                            bookingReference: (updatedBooking as any).bookingReference,
                            tourName: tour?.title || 'Your Yatra',
                            travelDate: new Date((updatedBooking as any).travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                            numberOfTravelers: (updatedBooking as any).numberOfTravelers,
                            totalAmount: (updatedBooking as any).totalAmount,
                        },
                    );

                    // 1.5 Generate Invoice and Send Multi-Channel Notifications
                    try {
                        const pdfBuffer = await this.invoiceService.generateInvoicePdf(updatedBooking);
                        const fileName = `invoice-${(updatedBooking as any).bookingReference}`;
                        const invoiceUrl = await this.invoiceService.uploadToCloudinary(pdfBuffer, fileName);

                        // Send Invoice Email with attachment
                        await this.emailService.sendInvoiceEmail(
                            recipientEmail,
                            recipientName,
                            {
                                bookingReference: (updatedBooking as any).bookingReference,
                                tourName: tour?.title || 'Your Yatra',
                                totalAmount: (updatedBooking as any).totalAmount,
                                invoiceUrl: invoiceUrl,
                            },
                            pdfBuffer
                        );

                        // Send WhatsApp Notification with Receipt Doc
                        if (recipientPhone) {
                            await this.whatsappService.sendBookingInvoiceDoc(
                                recipientPhone,
                                invoiceUrl,
                                `${fileName}.pdf`,
                                {
                                    customerName: recipientName,
                                    bookingReference: (updatedBooking as any).bookingReference,
                                }
                            );
                        }
                    } catch (invoiceErr) {
                        console.error('Invoice generation/notification failed:', invoiceErr);
                    }

                    // 2. Send admin notification
                    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@vedictravel.com';
                    await this.emailService.sendAdminNewBookingNotificationEmail(
                        adminEmail,
                        {
                            bookingReference: (updatedBooking as any).bookingReference,
                            customerName: recipientName,
                            customerEmail: recipientEmail,
                            customerPhone: recipientPhone,
                            tourName: tour?.title || 'Your Yatra',
                            travelDate: new Date((updatedBooking as any).travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                            numberOfTravelers: (updatedBooking as any).numberOfTravelers,
                            totalAmount: (updatedBooking as any).totalAmount,
                            paymentId: mihpayid,
                        },
                    );
                }
            } catch (emailErr) {
                console.error('Failed to send booking notification emails:', emailErr);
            }
        } else {
            const updatedBooking = await this.bookingsService.updatePaymentStatus(
                bookingId,
                PaymentStatus.FAILED,
                mihpayid,
                txnid,
            );

            // Send payment failure email
            try {
                const tour = (updatedBooking as any).tour;
                const recipientEmail = email || (updatedBooking as any).email || (updatedBooking as any).user?.email || '';
                const billingName = (updatedBooking as any).billingAddress ? `${(updatedBooking as any).billingAddress.firstName} ${(updatedBooking as any).billingAddress.lastName}` : '';
                const recipientName = billingName || firstname || (updatedBooking as any).user?.name || (updatedBooking as any).travelerDetails?.[0]?.name || 'Valued Guest';
                const recipientPhone = (updatedBooking as any).phone || (updatedBooking as any).user?.phone || '';

                if (recipientEmail) {
                    await this.emailService.sendPaymentFailureEmail(
                        recipientEmail,
                        recipientName,
                        {
                            bookingReference: (updatedBooking as any).bookingReference,
                            tourName: tour?.title || 'Your Yatra',
                            totalAmount: (updatedBooking as any).totalAmount,
                            transactionId: txnid,
                        }
                    );
                }
            } catch (emailErr) {
                console.error('Failed to send payment failure email:', emailErr);
            }
        }

        return {
            success: status === 'success',
            bookingId,
            transactionId: txnid,
            paymentId: mihpayid,
        };
    }

    private generatePayUHash(
        txnid: string,
        amount: string,
        productinfo: string,
        firstname: string,
        email: string,
        udf1: string = '',
    ): string {
        // Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
        // = udf1 + 10 pipes after it (udf2,udf3,udf4,udf5 empty + 5 blanks + SALT) = 10 separators
        const hashString = `${this.merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${this.merchantSalt}`;
        return crypto.createHash('sha512').update(hashString).digest('hex');
    }

    private generatePayUResponseHash(
        status: string,
        txnid: string,
        amount: string,
        productinfo: string,
        firstname: string,
        email: string,
        bookingId: string
    ): string {
        // Response hash: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        const hashString = `${this.merchantSalt}|${status}||||||||||${bookingId}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${this.merchantKey}`;
        return crypto.createHash('sha512').update(hashString).digest('hex');
    }

    private generateTransactionId(): string {
        return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    }
}
