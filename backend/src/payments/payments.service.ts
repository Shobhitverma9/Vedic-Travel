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

        // Debug logging and validation for production deployment
        if (process.env.NODE_ENV === 'production' || !this.payuBaseUrl) {
            console.log(`[PaymentsService] Configuration check:
                PAYU_BASE_URL: ${this.payuBaseUrl ? 'SET' : 'MISSING'} (${this.payuBaseUrl?.substring(0, 10)}${this.payuBaseUrl ? '...' : ''})
                PAYU_MERCHANT_KEY: ${this.merchantKey ? 'SET' : 'MISSING'}
                PAYU_SUCCESS_URL: ${this.successUrl ? 'SET' : 'MISSING'}
                PAYU_FAILURE_URL: ${this.failureUrl ? 'SET' : 'MISSING'}
            `);

            if (process.env.NODE_ENV === 'production' && this.payuBaseUrl?.includes('test')) {
                console.warn('⚠️ WARNING: PayU is configured to TEST environment in PRODUCTION mode!');
            }
            if (process.env.NODE_ENV === 'production' && (!this.merchantKey || this.merchantKey === 'your-payu-key')) {
                console.error('❌ ERROR: PayU Merchant Key is missing or placeholder value in production!');
            }
        }
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

    async initiatePayment(bookingId: string, userId?: string, providedAmount?: number) {
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

        if (!this.payuBaseUrl) {
            console.error('[PaymentsService] Cannot initiate payment: PAYU_BASE_URL is missing in environment variables');
            throw new BadRequestException('Payment gateway configuration error. Please contact support.');
        }

        let txnid = booking.payuTransactionId;
        if (!txnid) {
            txnid = this.generateTransactionId();
            // Save the transaction ID immediately for reliability and reconciliation
            await this.bookingModel.findByIdAndUpdate(bookingId, { payuTransactionId: txnid });
        }

        const amount = (providedAmount || booking.totalAmount).toFixed(2);
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
            mode,
            pg,
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

        // ────────────────────────────────────────────────────────────────────────
        // GUARD 1 – Atomic payment-status + paidAmount update
        //
        // PayU fires TWO simultaneous requests after every payment:
        //   (a) Browser redirect → POST /payments/verify
        //   (b) Server webhook   → POST /payments/webhook
        //
        // Both call this method. We use findOneAndUpdate with $inc so that
        // paidAmount is ONLY added once regardless of race conditions.
        // Only the request that transitions the status from non-SUCCESS to SUCCESS
        // gets a non-null result; the other silently returns.
        // ────────────────────────────────────────────────────────────────────────
        if (status === 'success') {
            const step1 = await this.bookingModel.findOneAndUpdate(
                { _id: bookingId, paymentStatus: { $ne: PaymentStatus.SUCCESS } },
                {
                    $set: {
                        paymentStatus: PaymentStatus.SUCCESS,
                        bookingStatus: 'confirmed',
                        paymentId: mihpayid || '',
                        payuTransactionId: txnid || '',
                        paymentMethod: mode || '',
                    },
                    $inc: { paidAmount: parseFloat(amount) || 0 },
                },
                { new: true },
            );

            if (!step1) {
                console.log(`[PaymentsService] GUARD 1 blocked duplicate for booking ${bookingId}.`);
                return { success: true, bookingId, transactionId: txnid, paymentId: mihpayid, alreadyProcessed: true };
            }

            // Note: Tour booking count increment is handled by bookingsService
            // which has the tour model injected.

            // ────────────────────────────────────────────────────────────────────
            // GUARD 2 – Atomic notification claim via notificationsSent flag
            //
            // Even if Guard 1 allowed both requests through (extremely unlikely),
            // this second atomic operation ensures notifications fire EXACTLY ONCE.
            // ────────────────────────────────────────────────────────────────────
            const step2 = await this.bookingModel.findOneAndUpdate(
                { _id: bookingId, notificationsSent: { $ne: true } },
                { $set: { notificationsSent: true } },
                { new: false },
            );

            if (!step2) {
                console.log(`[PaymentsService] GUARD 2 blocked duplicate notifications for booking ${bookingId}.`);
                return { success: true, bookingId, transactionId: txnid, paymentId: mihpayid, alreadyProcessed: true };
            }

            // We exclusively own notification rights — fetch fresh populated data
            const updatedBooking = await this.bookingModel.findById(bookingId).populate(['tour', 'user']);
            if (!updatedBooking) {
                return { success: true, bookingId, transactionId: txnid, paymentId: mihpayid };
            }

            // ── Send all notifications ────────────────────────────────────────
            try {
                const tour = (updatedBooking as any).tour;
                const recipientEmail = email || (updatedBooking as any).email || (updatedBooking as any).user?.email || '';
                const billingName = (updatedBooking as any).billingAddress
                    ? `${(updatedBooking as any).billingAddress.firstName} ${(updatedBooking as any).billingAddress.lastName}`
                    : '';
                const recipientName = billingName || firstname || (updatedBooking as any).user?.name
                    || (updatedBooking as any).travelerDetails?.[0]?.name || 'Valued Guest';
                const recipientPhone = (updatedBooking as any).phone || (updatedBooking as any).user?.phone || '';
                const travelDateFormatted = new Date((updatedBooking as any).travelDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
                });

                if (recipientEmail) {
                    // 1. Booking confirmation
                    await this.emailService.sendBookingConfirmationEmail(recipientEmail, recipientName, {
                        bookingId: (updatedBooking as any)._id.toString(),
                        bookingReference: (updatedBooking as any).bookingReference,
                        tourName: tour?.title || 'Your Yatra',
                        travelDate: travelDateFormatted,
                        numberOfTravelers: (updatedBooking as any).numberOfTravelers,
                        totalAmount: (updatedBooking as any).totalAmount,
                        paidAmount: (updatedBooking as any).paidAmount,
                    });

                    // 2. Invoice PDF + email + WhatsApp
                    try {
                        const pdfBuffer = await this.invoiceService.generateInvoicePdf(updatedBooking, parseFloat(amount));
                        const fileName = `invoice-${(updatedBooking as any).bookingReference}`;
                        const invoiceUrl = await this.invoiceService.uploadToCloudinary(pdfBuffer, fileName);

                        await this.emailService.sendInvoiceEmail(recipientEmail, recipientName, {
                            bookingReference: (updatedBooking as any).bookingReference,
                            tourName: tour?.title || 'Your Yatra',
                            totalAmount: (updatedBooking as any).totalAmount,
                            invoiceUrl,
                        }, pdfBuffer);

                        if (recipientPhone) {
                            await this.whatsappService.sendBookingInvoiceDoc(
                                recipientPhone, invoiceUrl, `${fileName}.pdf`,
                                { customerName: recipientName, bookingReference: (updatedBooking as any).bookingReference },
                            );
                        }
                    } catch (invoiceErr) {
                        console.error('[PaymentsService] Invoice error:', invoiceErr);
                    }

                    // 3. Admin notification
                    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@vedictravel.com';
                    await this.emailService.sendAdminNewBookingNotificationEmail(adminEmail, {
                        bookingReference: (updatedBooking as any).bookingReference,
                        customerName: recipientName,
                        customerEmail: recipientEmail,
                        customerPhone: recipientPhone,
                        tourName: tour?.title || 'Your Yatra',
                        travelDate: travelDateFormatted,
                        numberOfTravelers: (updatedBooking as any).numberOfTravelers,
                        totalAmount: (updatedBooking as any).totalAmount,
                        paidAmount: (updatedBooking as any).paidAmount,
                        paymentMethod: (updatedBooking as any).paymentMethod,
                        paymentId: mihpayid,
                    });
                }
            } catch (emailErr) {
                console.error('[PaymentsService] Failed to send notifications:', emailErr);
            }
        } else {
            // ── Payment failed ───────────────────────────────────────────────
            const updatedBooking = await this.bookingsService.updatePaymentStatus(
                bookingId, PaymentStatus.FAILED, mihpayid, txnid,
            );
            try {
                const tour = (updatedBooking as any).tour;
                const recipientEmail = email || (updatedBooking as any).email || (updatedBooking as any).user?.email || '';
                const billingName = (updatedBooking as any).billingAddress
                    ? `${(updatedBooking as any).billingAddress.firstName} ${(updatedBooking as any).billingAddress.lastName}`
                    : '';
                const recipientName = billingName || firstname || (updatedBooking as any).user?.name
                    || (updatedBooking as any).travelerDetails?.[0]?.name || 'Valued Guest';
                if (recipientEmail) {
                    await this.emailService.sendPaymentFailureEmail(recipientEmail, recipientName, {
                        bookingReference: (updatedBooking as any).bookingReference,
                        tourName: tour?.title || 'Your Yatra',
                        totalAmount: (updatedBooking as any).totalAmount,
                        transactionId: txnid,
                    });
                }
            } catch (emailErr) {
                console.error('[PaymentsService] Payment failure email error:', emailErr);
            }
        }

        return { success: status === 'success', bookingId, transactionId: txnid, paymentId: mihpayid };
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
