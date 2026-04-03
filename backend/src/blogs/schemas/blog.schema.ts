import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ _id: false })
export class BlogSeo {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop([String])
    keywords: string[];
}

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop()
    excerpt: string;

    // Editor.js JSON content (new format)
    @Prop({ type: Object })
    content: any;

    // Featured image (can also be stored as 'image' for legacy compatibility)
    @Prop()
    image: string;

    @Prop()
    featuredImage: string;

    @Prop()
    author: string;

    @Prop()
    category: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: 'draft', enum: ['draft', 'published'] })
    status: string;

    // Legacy active flag — kept for backward compatibility
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: Date.now })
    publishedDate: Date;

    @Prop()
    publishedAt: Date;

    @Prop({ default: 0 })
    views: number;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ type: BlogSeo })
    seo: BlogSeo;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Indexes
BlogSchema.index({ title: 'text', excerpt: 'text' });
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ isActive: 1 });
BlogSchema.index({ status: 1 });
