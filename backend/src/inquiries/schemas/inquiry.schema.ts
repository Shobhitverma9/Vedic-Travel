import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true })
export class Inquiry {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    mobile: string;

    @Prop({ default: 0 })
    adults: number;

    @Prop({ default: 0 })
    children: number;

    @Prop({ default: 0 })
    infants: number;

    @Prop()
    message: string;

    @Prop({ required: false })
    tourId: string;

    @Prop({ required: false })
    tourName: string;

    @Prop({ required: false })
    yatraId: string;

    @Prop({ required: false })
    yatraName: string;

    @Prop({ default: 'new' })
    status: string;

    @Prop({ default: false })
    isCorporate: boolean;

    @Prop()
    companyName: string;

    @Prop()
    officeAddress: string;

    @Prop()
    teamSize: string;

    @Prop()
    journeyDate: string;

    @Prop()
    budget: string;

    @Prop({ default: false })
    isCustomizable: boolean;

    @Prop()
    duration: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
