import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Booking, BookingDocument, PaymentStatus } from '../bookings/schemas/booking.schema';
import { BookingsService } from '../bookings/bookings.service';
import { EmailService } from '../email/email.service';

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
    ) {
        this.merchantKey = this.configService.get<string>('PAYU_MERCHANT_KEY');
        this.merchantSalt = this.configService.get<string>('PAYU_MERCHANT_SALT');
        this.payuBaseUrl = this.configService.get<string>('PAYU_BASE_URL');
        this.successUrl = this.configService.get<string>('PAYU_SUCCESS_URL');
        this.failureUrl = this.configService.get<string>('PAYU_FAILURE_URL');
    }



    async getEmiOptions(amount: number) {
        // Mock EMI options from major banks
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

        // Flatten plans for "all plans" view or just return structure
        const allPlans = bankPlans.flatMap(bp => bp.plans.map(p => ({ ...p, bank: bp.bank })));

        // Find absolute lowest emi across all banks and tenures
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

        // Handle guest vs logged-in user
        let firstname = '';
        let email = '';
        let phone = '';

        if (booking.user) {
            firstname = (booking.user as any).name;
            email = (booking.user as any).email;
            phone = (booking.user as any).phone || '';
        } else {
            firstname = (booking as any).travelerDetails?.[0]?.name || 'Guest';
            email = (booking as any).email || '';
            phone = (booking as any).phone || '';
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
                const recipientEmail = email || (updatedBooking as any).email || '';
                const recipientName = firstname || (updatedBooking as any).travelerDetails?.[0]?.name || 'Valued Guest';

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
                }
            } catch (emailErr) {
                console.error('Failed to send booking confirmation email:', emailErr);
                // Do not fail the payment response if email fails
            }
        } else {
            await this.bookingsService.updatePaymentStatus(
                bookingId,
                PaymentStatus.FAILED,
                mihpayid,
                txnid,
            );
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
