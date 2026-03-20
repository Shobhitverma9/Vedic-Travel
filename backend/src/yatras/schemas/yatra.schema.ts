import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Tour } from '../../tours/schemas/tour.schema';

export type YatraDocument = Yatra & Document;

@Schema({ timestamps: true })
export class Yatra {
    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    heroImage: string;

    @Prop()
    longDescription: string;

    @Prop({ type: [String], default: [] })
    thumbnailImages: string[];

    @Prop({ type: [{ question: String, answer: String }], default: [] })
    faqs: { question: string; answer: string }[];

    @Prop({ required: true, default: 'Pilgrimage Yatra Packages' })
    category: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isVedicImprint: boolean;

    @Prop({ default: false })
    showOnHome: boolean;

    @Prop({ default: 0 })
    rank: number;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tour' }], default: [] })
    packages: Tour[];
}

export const YatraSchema = SchemaFactory.createForClass(Yatra);

// Indexes
YatraSchema.index({ title: 'text', description: 'text' });
YatraSchema.index({ slug: 1 }, { unique: true });
YatraSchema.index({ isActive: 1 });
YatraSchema.index({ rank: 1 });
