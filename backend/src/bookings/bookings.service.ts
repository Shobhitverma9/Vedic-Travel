import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from './schemas/booking.schema';
import { Tour, TourDocument } from '../tours/schemas/tour.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    ) { }

    async create(userId: string, createBookingDto: CreateBookingDto) {
        const { tourId, numberOfTravelers, travelDate, travelerDetails, email, phone } = createBookingDto;

        // Validate tour
        const tour = await this.tourModel.findById(tourId);
        if (!tour || !tour.isActive) {
            throw new NotFoundException('Tour not found or inactive');
        }

        // Check group size
        if (numberOfTravelers > tour.maxGroupSize) {
            throw new BadRequestException(`Maximum group size is ${tour.maxGroupSize}`);
        }

        // Calculate total amount
        const totalAmount = tour.price * numberOfTravelers;

        // Generate booking reference
        const bookingReference = this.generateBookingReference();

        // Create booking
        const booking = await this.bookingModel.create({
            user: userId,
            tour: tourId,
            numberOfTravelers,
            travelDate,
            totalAmount,
            travelerDetails,
            bookingReference,
            specialRequests: createBookingDto.specialRequests,
            email,
            phone,
        });

        return booking.populate(['user', 'tour']);
    }

    async findUserBookings(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [bookings, total] = await Promise.all([
            this.bookingModel
                .find({ user: userId })
                .populate('tour')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.bookingModel.countDocuments({ user: userId }),
        ]);

        return {
            bookings,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string, userId?: string) {
        const query: any = { _id: id };
        if (userId) {
            query.user = userId;
        }

        const booking = await this.bookingModel.findOne(query).populate(['user', 'tour']);
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        return booking;
    }

    async updatePaymentStatus(
        bookingId: string,
        paymentStatus: PaymentStatus,
        paymentId?: string,
        payuTransactionId?: string,
    ) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Idempotency check: if already successful, don't re-process logic that should run once
        if (booking.paymentStatus === PaymentStatus.SUCCESS && paymentStatus === PaymentStatus.SUCCESS) {
            return booking;
        }

        booking.paymentStatus = paymentStatus;
        if (paymentId) booking.paymentId = paymentId;
        if (payuTransactionId) booking.payuTransactionId = payuTransactionId;

        // Update booking status based on payment
        if (paymentStatus === PaymentStatus.SUCCESS) {
            booking.bookingStatus = BookingStatus.CONFIRMED;

            // Update tour booking count
            await this.tourModel.findByIdAndUpdate(booking.tour, {
                $inc: { totalBookings: 1 },
            });
        }

        await booking.save();
        return booking.populate('tour');
    }

    async cancelBooking(id: string, userId: string, reason: string) {
        const booking = await this.bookingModel.findOne({ _id: id, user: userId });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.bookingStatus === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking already cancelled');
        }

        if (booking.bookingStatus === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cannot cancel completed booking');
        }

        booking.bookingStatus = BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
        booking.cancellationReason = reason;

        await booking.save();
        return booking;
    }

    async getAllBookings(query: any = {}) {
        const {
            page = 1,
            limit = 20,
            status,
            paymentStatus,
            fromDate,
            toDate,
        } = query;

        const filter: any = {};

        if (status) filter.bookingStatus = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (fromDate || toDate) {
            filter.travelDate = {};
            if (fromDate) filter.travelDate.$gte = new Date(fromDate);
            if (toDate) filter.travelDate.$lte = new Date(toDate);
        }

        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            this.bookingModel
                .find(filter)
                .populate(['user', 'tour'])
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            this.bookingModel.countDocuments(filter),
        ]);

        return {
            bookings,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        };
    }

    async createFromCart(userId: string, checkoutDto: CreateCheckoutDto) {
        // Get user's cart
        const cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.tour');

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const bookings = [];
        let totalAmount = 0;

        // Create bookings for each cart item
        for (const item of cart.items as any[]) {
            const tour = item.tour;

            // Validate tour is still active
            if (!tour || !tour.isActive) {
                throw new BadRequestException(`Tour ${tour?.title || 'unknown'} is no longer available`);
            }

            // Validate travel date
            if (new Date(item.travelDate) < new Date()) {
                throw new BadRequestException('Travel date must be in the future');
            }

            // Check group size
            if (item.quantity > tour.maxGroupSize) {
                throw new BadRequestException(`${tour.title}: Maximum group size is ${tour.maxGroupSize}`);
            }

            // Calculate amount for this booking
            const bookingAmount = tour.price * item.quantity;
            totalAmount += bookingAmount;

            // Create booking
            const booking = await this.bookingModel.create({
                user: userId,
                tour: tour._id,
                numberOfTravelers: item.quantity,
                travelDate: item.travelDate,
                totalAmount: bookingAmount,
                travelerDetails: checkoutDto.travelerDetails.slice(0, item.quantity),
                specialRequests: checkoutDto.specialRequests,
                bookingReference: this.generateBookingReference(),
            });

            bookings.push(booking);
        }

        // Clear cart after successful booking creation
        cart.items = [];
        await cart.save();

        return {
            bookings: bookings.map(b => b._id),
            totalAmount,
            message: 'Bookings created successfully',
        };
    }

    async createGuestBooking(guestDto: any) {
        const { items, travelerDetails, specialRequests, email, phone } = guestDto;
        const bookings = [];
        let totalAmount = 0;

        for (const item of items) {
            const tour = await this.tourModel.findById(item.tourId);
            if (!tour || !tour.isActive) {
                throw new BadRequestException(`Tour not found or inactive: ${item.tourId}`);
            }

            if (item.quantity > tour.maxGroupSize) {
                throw new BadRequestException(`${tour.title}: Maximum group size is ${tour.maxGroupSize}`);
            }

            const bookingAmount = tour.price * item.quantity;
            totalAmount += bookingAmount;

            const booking = await this.bookingModel.create({
                tour: tour._id,
                numberOfTravelers: item.quantity,
                travelDate: item.travelDate,
                totalAmount: bookingAmount,
                travelerDetails: travelerDetails.slice(0, item.quantity),
                specialRequests,
                bookingReference: this.generateBookingReference(),
                email,
                phone,
                isGuest: true,
            });

            bookings.push(booking);
        }

        return {
            bookings: bookings.map(b => b._id),
            totalAmount,
            message: 'Guest bookings created successfully',
        };
    }

    private generateBookingReference(): string {
        const prefix = 'VT';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
}
