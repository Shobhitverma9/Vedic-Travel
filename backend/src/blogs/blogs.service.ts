import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        private readonly filesService: FilesService,
    ) { }

    async create(createBlogDto: CreateBlogDto): Promise<Blog> {
        // Auto-generate slug if not provided
        if (!createBlogDto.slug) {
            const slug = createBlogDto.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            let finalSlug = slug;
            let counter = 1;
            while (await this.blogModel.findOne({ slug: finalSlug })) {
                finalSlug = `${slug}-${counter}`;
                counter++;
            }
            createBlogDto.slug = finalSlug;
        }

        // Set publishedAt if status is published
        if (createBlogDto.status === 'published' && !createBlogDto.publishedAt) {
            createBlogDto.publishedAt = new Date();
        }

        // Sync isActive with status for legacy compatibility
        if (createBlogDto.status === 'published') {
            createBlogDto.isActive = true;
        } else if (createBlogDto.status === 'draft') {
            createBlogDto.isActive = false;
        }

        const createdBlog = new this.blogModel(createBlogDto);
        return createdBlog.save();
    }

    async findAll(limit?: number): Promise<Blog[]> {
        const query = this.blogModel
            .find({ $or: [{ isActive: true }, { status: 'published' }] })
            .sort({ publishedAt: -1, publishedDate: -1 });
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
        const blog = await this.blogModel.findOne({
            slug,
            $or: [{ isActive: true }, { status: 'published' }]
        }).exec();
        if (!blog) {
            throw new NotFoundException(`Blog with slug ${slug} not found`);
        }
        return blog;
    }

    async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
        // Set publishedAt if publishing for the first time
        if (updateBlogDto.status === 'published' && !updateBlogDto.publishedAt) {
            updateBlogDto.publishedAt = new Date();
        }

        // Sync isActive with status
        if (updateBlogDto.status === 'published') {
            updateBlogDto.isActive = true;
        } else if (updateBlogDto.status === 'draft') {
            updateBlogDto.isActive = false;
        }

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

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return this.filesService.uploadImage(file, 'image');
    }

    async incrementViews(id: string): Promise<void> {
        await this.blogModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
    }
}
