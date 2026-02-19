import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramPost, InstagramPostDocument } from './schemas/instagram-post.schema';
import { CreateInstagramPostDto } from './dto/create-instagram-post.dto';
import { UpdateInstagramPostDto } from './dto/update-instagram-post.dto';

@Injectable()
export class InstagramService {
    constructor(
        @InjectModel(InstagramPost.name) private instagramPostModel: Model<InstagramPostDocument>,
    ) { }

    async create(createInstagramPostDto: CreateInstagramPostDto): Promise<InstagramPost> {
        const createdPost = new this.instagramPostModel(createInstagramPostDto);
        return createdPost.save();
    }

    async findAll(query: any = {}): Promise<InstagramPost[]> {
        const filter: any = {};
        if (query.activeOnly === 'true') {
            filter.isActive = true;
        }
        return this.instagramPostModel.find(filter).sort({ order: 1, createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<InstagramPost> {
        const post = await this.instagramPostModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException(`Instagram post with ID ${id} not found`);
        }
        return post;
    }

    async update(id: string, updateInstagramPostDto: UpdateInstagramPostDto): Promise<InstagramPost> {
        const updatedPost = await this.instagramPostModel
            .findByIdAndUpdate(id, updateInstagramPostDto, { new: true })
            .exec();
        if (!updatedPost) {
            throw new NotFoundException(`Instagram post with ID ${id} not found`);
        }
        return updatedPost;
    }

    async remove(id: string): Promise<void> {
        const result = await this.instagramPostModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Instagram post with ID ${id} not found`);
        }
    }
}
