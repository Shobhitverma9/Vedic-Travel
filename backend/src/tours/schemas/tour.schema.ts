import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TourDocument = Tour & Document;

@Schema({ _id: false })
export class AdvancePayment {
    @Prop({ required: true })
    amount: number;

    @Prop({ type: String, enum: ['fixed', 'percentage'], default: 'fixed' })
    paymentType: string;
}

@Schema({ timestamps: true })
export class Tour {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ required: true })
    price: number;

    @Prop()
    priceOriginal: number;

    @Prop({ default: 'Land Only' })
    packageType: string;

    @Prop({ required: true })
    duration: number; // in days

    @Prop({ type: [String], required: true })
    locations: string[];

    @Prop({ type: [String], default: [] })
    slideshowImages: string[];

    @Prop({ type: [Object], default: [] })
    placesHighlights: { image: string; title: string }[];

    @Prop({ required: false })
    placesToVisit: string;

    @Prop({ type: [Object], default: [] })
    itinerary: {
        day: number;
        title: string;
        description: string;
        items: {
            type: string; // 'hotel' | 'transfer' | 'meal' | 'activity' | 'flight' | 'checkout'
            title?: string;
            description?: string;
            image?: string;
            time?: string;
        }[];
    }[];

    @Prop({ type: [String], default: [] })
    packageIncludes: string[]; // Categories like 'Hotel', 'Transfer'

    @Prop({ type: [Object], default: [] })
    hotels: {
        name: string;
        image: string;
        description: string;
        rating: number;
    }[];

    @Prop({ type: [String], default: [] })
    inclusions: string[];

    @Prop({ type: [String], default: [] })
    exclusions: string[];

    @Prop({ type: [String], default: [] })
    dos: string[];

    @Prop({ type: [String], default: [] })
    donts: string[];

    @Prop({ type: [String], default: [] })
    thingsToCarry: string[];

    @Prop({ required: true })
    maxGroupSize: number;

    @Prop({ type: [Date], default: [] })
    availableDates: Date[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0 })
    totalBookings: number;

    @Prop({ default: 5 })
    rating: number;

    @Prop({ default: 0 })
    reviewsCount: number;

    @Prop({ default: false })
    isTrending: boolean;

    @Prop({ default: 0 })
    trendingRank: number;

    @Prop()
    category: string;

    @Prop()
    destination: string;

    @Prop({ type: Object })
    highlights: {
        temples: string[];
        experiences: string[];
        spiritual: string[];
    };

    @Prop({ default: false })
    isFavorite: boolean;

    @Prop({ default: 'standard' }) // 'large' or 'standard'
    favoriteSize: string;

    @Prop()
    badge: string; // e.g., 'Popular', 'Best Seller'

    @Prop()
    emiStartingFrom: number;

    @Prop({
        type: [{
            city: { type: String, required: true },
            surcharge: { type: Number, default: 0 },
            isDefault: { type: Boolean, default: false },
            availabilityType: { type: String, enum: ['specific_dates', 'weekly', 'daily'], default: 'specific_dates' },
            availableDates: { type: [Date], default: [] },
            weeklyDays: { type: [Number], default: [] }, // 0=Sun, 1=Mon...
            blackoutDates: { type: [Date], default: [] }
        }],
        default: []
    })
    departureCities: {
        city: string;
        surcharge: number;
        isDefault: boolean;
        availabilityType: string;
        availableDates: Date[];
        weeklyDays: number[];
        blackoutDates: Date[];
    }[];

    @Prop({ type: AdvancePayment, default: { amount: 5000, paymentType: 'fixed' } })
    advancePayment: AdvancePayment;
}

export const TourSchema = SchemaFactory.createForClass(Tour);

// Indexes
TourSchema.index({ title: 'text', description: 'text' });
TourSchema.index({ slug: 1 }, { unique: true });
TourSchema.index({ isActive: 1 });
