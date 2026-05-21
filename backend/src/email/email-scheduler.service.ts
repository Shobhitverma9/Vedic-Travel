import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from '../bookings/schemas/booking.schema';
import { Tour, TourDocument } from '../tours/schemas/tour.schema';
import { EmailService } from './email.service';
import { WhatsappService } from '../notifications/whatsapp.service';

@Injectable()
export class EmailSchedulerService {
    private readonly logger = new Logger(EmailSchedulerService.name);

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        private emailService: EmailService,
        private whatsappService: WhatsappService,
    ) { }

    /**
     * Sends trip countdown reminders 3 days before travelDate.
     * Runs every day at 10:00 AM.
     */
    @Cron('0 10 * * *')
    async handleTripReminders() {
        this.logger.log('Running Cron: Trip Reminders (3 Days Before)');
        
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        threeDaysFromNow.setHours(0, 0, 0, 0);

        const nextDay = new Date(threeDaysFromNow);
        nextDay.setDate(nextDay.getDate() + 1);

        const upcomingBookings = await this.bookingModel.find({
            travelDate: { $gte: threeDaysFromNow, $lt: nextDay },
            bookingStatus: BookingStatus.CONFIRMED,
        }).populate(['tour', 'user']);

        for (const booking of upcomingBookings) {
            try {
                const recipientEmail = booking.email || (booking.user as any)?.email;
                const recipientPhone = booking.phone || (booking.user as any)?.phone;
                const billingName = (booking as any).billingAddress ? `${(booking as any).billingAddress.firstName} ${(booking as any).billingAddress.lastName}` : '';
                const recipientName = billingName || (booking.user as any)?.name || booking.travelerDetails?.[0]?.name || 'Valued Guest';
                const travelDateFormatted = new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

                if (recipientEmail) {
                    await this.emailService.sendTripReminderEmail(
                        recipientEmail,
                        recipientName,
                        {
                            bookingReference: booking.bookingReference,
                            tourName: (booking.tour as any)?.title || 'Your Yatra',
                            travelDate: travelDateFormatted,
                            numberOfTravelers: booking.numberOfTravelers,
                        }
                    );
                    this.logger.log(`Sent trip reminder email to ${recipientEmail} for booking ${booking.bookingReference}`);
                }

                if (recipientPhone) {
                    await this.whatsappService.sendTripReminder(
                        recipientPhone,
                        recipientName,
                        {
                            bookingReference: booking.bookingReference,
                            tourName: (booking.tour as any)?.title || 'Your Yatra',
                            travelDate: travelDateFormatted,
                        }
                    );
                    this.logger.log(`Sent trip reminder WhatsApp to ${recipientPhone} for booking ${booking.bookingReference}`);
                }
            } catch (error) {
                this.logger.error(`Failed to send trip reminder for booking ${booking.bookingReference}:`, error);
            }
        }
    }

    /**
     * Sends reminders for pending payments (Abandoned Checkout) 2 hours after creation.
     * Runs every 30 minutes.
     */
    @Cron(CronExpression.EVERY_30_MINUTES)
    async handlePendingPayments() {
        this.logger.log('Running Cron: Pending Payment Reminders (2 Hours After Creation)');
        
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

        const threeHoursAgo = new Date();
        threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

        const pendingBookings = await this.bookingModel.find({
            paymentStatus: PaymentStatus.PENDING,
            createdAt: { $gte: threeHoursAgo, $lt: twoHoursAgo },
        }).populate(['tour', 'user']);

        for (const booking of pendingBookings) {
            try {
                const recipientEmail = booking.email || (booking.user as any)?.email;
                const recipientPhone = booking.phone || (booking.user as any)?.phone;
                const billingName = (booking as any).billingAddress ? `${(booking as any).billingAddress.firstName} ${(booking as any).billingAddress.lastName}` : '';
                const recipientName = billingName || (booking.user as any)?.name || booking.travelerDetails?.[0]?.name || 'Valued Guest';

                if (recipientEmail) {
                    await this.emailService.sendPendingPaymentReminderEmail(
                        recipientEmail,
                        recipientName,
                        {
                            bookingReference: booking.bookingReference,
                            tourName: (booking.tour as any)?.title || 'Your Yatra',
                            totalAmount: booking.totalAmount,
                        }
                    );
                    this.logger.log(`Sent pending payment reminder email to ${recipientEmail} for booking ${booking.bookingReference}`);
                }

                if (recipientPhone) {
                    await this.whatsappService.sendPendingPaymentReminder(
                        recipientPhone,
                        recipientName,
                        {
                            bookingReference: booking.bookingReference,
                            tourName: (booking.tour as any)?.title || 'Your Yatra',
                            totalAmount: booking.totalAmount,
                        }
                    );
                    this.logger.log(`Sent pending payment reminder WhatsApp to ${recipientPhone} for booking ${booking.bookingReference}`);
                }
            } catch (error) {
                this.logger.error(`Failed to send pending payment reminder for booking ${booking.bookingReference}:`, error);
            }
        }
    }

    /**
     * Sends feedback requests 1 day after travelDate.
     * Runs every day at 11:00 AM.
     */
    @Cron('0 11 * * *')
    async handleFeedbackRequests() {
        this.logger.log('Running Cron: Post-Trip Feedback Requests (1 Day After)');
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const todayStart = new Date(yesterday);
        todayStart.setDate(todayStart.getDate() + 1);

        const completedBookings = await this.bookingModel.find({
            travelDate: { $gte: yesterday, $lt: todayStart },
            bookingStatus: BookingStatus.CONFIRMED, // Or COMPLETED if you have a workflow to update it
        }).populate(['tour', 'user']);

        for (const booking of completedBookings) {
            try {
                const recipientEmail = booking.email || (booking.user as any)?.email;
                const recipientPhone = booking.phone || (booking.user as any)?.phone;
                const billingName = (booking as any).billingAddress ? `${(booking as any).billingAddress.firstName} ${(booking as any).billingAddress.lastName}` : '';
                const recipientName = billingName || (booking.user as any)?.name || booking.travelerDetails?.[0]?.name || 'Valued Guest';

                if (recipientEmail) {
                    await this.emailService.sendFeedbackRequestEmail(
                        recipientEmail,
                        recipientName,
                        {
                            bookingReference: booking.bookingReference,
                            tourName: (booking.tour as any)?.title || 'Your Yatra',
                        }
                    );
                    this.logger.log(`Sent feedback request email to ${recipientEmail} for booking ${booking.bookingReference}`);
                }

                if (recipientPhone) {
                    await this.whatsappService.sendFeedbackRequest(
                        recipientPhone,
                        recipientName,
                        {
                            bookingReference: booking.bookingReference,
                            tourName: (booking.tour as any)?.title || 'Your Yatra',
                        }
                    );
                    this.logger.log(`Sent feedback request WhatsApp to ${recipientPhone} for booking ${booking.bookingReference}`);
                }
            } catch (error) {
                this.logger.error(`Failed to send feedback request for booking ${booking.bookingReference}:`, error);
            }
        }
    }
}
