import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Booking {
    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    user?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Tour', required: true })
    tour: Types.ObjectId;

    @Prop({ required: true })
    numberOfTravelers: number;

    @Prop({ required: true })
    travelDate: Date;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ default: PaymentStatus.PENDING, enum: PaymentStatus })
    paymentStatus: PaymentStatus;

    @Prop()
    paymentId: string;

    @Prop()
    payuTransactionId: string;

    @Prop({ default: BookingStatus.PENDING, enum: BookingStatus })
    bookingStatus: BookingStatus;

    @Prop({ type: [Object], required: true })
    travelerDetails: {
        name: string;
        age: number;
        gender: string;
        idProof: string;
    }[];

    @Prop()
    specialRequests: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop({ default: false })
    isGuest: boolean;

    @Prop()
    bookingReference: string;

    @Prop()
    cancelledAt: Date;

    @Prop()
    cancellationReason: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Indexes
BookingSchema.index({ user: 1 });
BookingSchema.index({ tour: 1 });
BookingSchema.index({ bookingReference: 1 }, { unique: true, sparse: true });
BookingSchema.index({ bookingStatus: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ travelDate: 1 });
