import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

    async create(createBlogDto: CreateBlogDto): Promise<Blog> {
        const slug = createBlogDto.title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        // Ensure unique slug
        let finalSlug = slug;
        let counter = 1;
        while (await this.blogModel.findOne({ slug: finalSlug })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        const createdBlog = new this.blogModel({
            ...createBlogDto,
            slug: finalSlug,
        });
        return createdBlog.save();
    }

    async findAll(limit?: number): Promise<Blog[]> {
        const query = this.blogModel.find({ isActive: true }).sort({ publishedDate: -1 });
        if (limit) {
            query.limit(limit);
        }
        return query.exec();
    }

    async findAllAdmin(): Promise<Blog[]> {
        return this.blogModel.find().sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Blog> {
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }

    async findBySlug(slug: string): Promise<Blog> {
        const blog = await this.blogModel.findOne({ slug, isActive: true }).exec();
        if (!blog) {
            throw new NotFoundException(`Blog with slug ${slug} not found`);
        }
        return blog;
    }

    async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
        const existingBlog = await this.blogModel
            .findByIdAndUpdate(id, updateBlogDto, { new: true })
            .exec();

        if (!existingBlog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        return existingBlog;
    }

    async remove(id: string): Promise<void> {
        const result = await this.blogModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
    }
}
