import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    excerpt: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    author: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: Date.now })
    publishedDate: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Indexes
BlogSchema.index({ title: 'text', content: 'text' });
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ isActive: 1 });
