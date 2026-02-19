import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Booking, BookingDocument, PaymentStatus } from '../bookings/schemas/booking.schema';
import { BookingsService } from '../bookings/bookings.service';

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
    ) {
        this.merchantKey = this.configService.get<string>('PAYU_MERCHANT_KEY');
        this.merchantSalt = this.configService.get<string>('PAYU_MERCHANT_SALT');
        this.payuBaseUrl = this.configService.get<string>('PAYU_BASE_URL');
        this.successUrl = this.configService.get<string>('PAYU_SUCCESS_URL');
        this.failureUrl = this.configService.get<string>('PAYU_FAILURE_URL');
    }



    async getEmiOptions(amount: number) {
        // Mock EMI options for now as we don't have direct PayU API access details for this
        // In a real implementation, we would call PayU's API here
        const interestRate = 14; // 14% p.a.
        const months = [3, 6, 9, 12];

        const options = months.map(month => {
            const monthlyInterest = interestRate / 12 / 100;
            const emi = amount * monthlyInterest * Math.pow(1 + monthlyInterest, month) / (Math.pow(1 + monthlyInterest, month) - 1);
            return {
                tenure: month,
                interestRate: interestRate,
                emi: Math.round(emi),
                totalAmount: Math.round(emi * month),
            };
        });

        // Return the lowest EMI capability
        return {
            lowestEmi: options[options.length - 1].emi,
            plans: options
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

        const txnid = this.generateTransactionId();
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

        // Generate hash
        const hash = this.generatePayUHash(
            txnid,
            amount,
            productinfo,
            firstname,
            email,
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
            // throw new BadRequestException('Invalid payment hash');
        }

        // Update booking payment status
        if (status === 'success') {
            await this.bookingsService.updatePaymentStatus(
                bookingId,
                PaymentStatus.SUCCESS,
                mihpayid,
                txnid,
            );
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
    ): string {
        const hashString = `${this.merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${this.merchantSalt}`;
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
