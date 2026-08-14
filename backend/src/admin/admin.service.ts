import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Tour, TourDocument } from '../tours/schemas/tour.schema';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from '../bookings/schemas/booking.schema';
import { Inquiry, InquiryDocument } from '../inquiries/schemas/inquiry.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    ) { }

    async getDashboardStats() {
        const [
            totalUsers,
            totalTours,
            totalBookings,
            confirmedBookings,
            pendingBookings,
            totalRevenue,
            recentBookings,
        ] = await Promise.all([
            this.userModel.countDocuments(),
            this.tourModel.countDocuments({ isActive: true }),
            this.bookingModel.countDocuments(),
            this.bookingModel.countDocuments({ bookingStatus: BookingStatus.CONFIRMED }),
            this.bookingModel.countDocuments({ bookingStatus: BookingStatus.PENDING }),
            this.bookingModel.aggregate([
                { $match: { paymentStatus: PaymentStatus.SUCCESS } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            this.bookingModel
                .find()
                .populate(['user', 'tour'])
                .sort({ createdAt: -1 })
                .limit(10),
        ]);

        return {
            totalUsers,
            totalTours,
            totalBookings,
            confirmedBookings,
            pendingBookings,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentBookings,
        };
    }

    async updateBookingStatus(bookingId: string, status: BookingStatus) {
        const booking = await this.bookingModel.findByIdAndUpdate(
            bookingId,
            { bookingStatus: status },
            { new: true },
        ).populate(['user', 'tour']);

        return booking;
    }

    async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
        const matchStage: any = { paymentStatus: PaymentStatus.SUCCESS };

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = startDate;
            if (endDate) matchStage.createdAt.$lte = endDate;
        }

        const analytics = await this.bookingModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    totalRevenue: { $sum: '$totalAmount' },
                    totalBookings: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
        ]);

        return analytics;
    }

    async getMonthlyAnalytics() {
        const bookingsAgg = await this.bookingModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        const inquiriesAgg = await this.inquiryModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Combine into a map by YYYY-MM
        const combined = new Map();
        
        bookingsAgg.forEach(b => {
            const dateKey = `${b._id.year}-${String(b._id.month).padStart(2, '0')}`;
            if (!combined.has(dateKey)) combined.set(dateKey, { name: dateKey, queries: 0, bookings: 0 });
            combined.get(dateKey).bookings = b.count;
        });

        inquiriesAgg.forEach(i => {
            const dateKey = `${i._id.year}-${String(i._id.month).padStart(2, '0')}`;
            if (!combined.has(dateKey)) combined.set(dateKey, { name: dateKey, queries: 0, bookings: 0 });
            combined.get(dateKey).queries = i.count;
        });

        // Convert to array and sort chronologically
        const analyticsData = Array.from(combined.values()).sort((a, b) => a.name.localeCompare(b.name));

        return analyticsData;
    }
}
