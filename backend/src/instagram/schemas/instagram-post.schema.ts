import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstagramPostDocument = InstagramPost & Document;

@Schema({ timestamps: true })
export class InstagramPost {
    @Prop({ required: false })
    title: string;

    @Prop({ required: false })
    caption: string;

    @Prop({ required: true })
    videoUrl: string;

    @Prop({ required: true })
    thumbnailUrl: string;

    @Prop({ required: true })
    instagramLink: string;

    @Prop({ default: 0 })
    views: number;

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const InstagramPostSchema = SchemaFactory.createForClass(InstagramPost);
