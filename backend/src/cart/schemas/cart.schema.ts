import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Tour', required: true })
    tour: Types.ObjectId;

    @Prop({ required: true, min: 1 })
    quantity: number; // number of travelers

    @Prop({ required: true })
    travelDate: Date;

    @Prop({ required: true })
    priceSnapshot: number; // price at the time of adding to cart

    @Prop({ default: Date.now })
    addedAt: Date;
}

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    user: Types.ObjectId;

    @Prop({ type: [CartItem], default: [] })
    items: CartItem[];

    @Prop()
    lastUpdated: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes
CartSchema.index({ user: 1 }, { unique: true });
CartSchema.index({ lastUpdated: 1 });

// Auto-update lastUpdated timestamp
CartSchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});
