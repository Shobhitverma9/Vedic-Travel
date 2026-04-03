import {
    Controller, Get, Post, Body, Patch, Param, Delete, Query,
    UseInterceptors, UploadedFile, HttpException, HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new blog post' })
    create(@Body() createBlogDto: CreateBlogDto) {
        return this.blogsService.create(createBlogDto);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload an image for the blog editor' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
            }
            const url = await this.blogsService.uploadImage(file);
            return { url };
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Image upload failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: 'Get all published blogs' })
    findAll(@Query('limit') limit?: number) {
        return this.blogsService.findAll(limit);
    }

    @Get('admin')
    @ApiOperation({ summary: 'Get all blogs for admin (includes drafts)' })
    findAllAdmin() {
        return this.blogsService.findAllAdmin();
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: 'Get blog by ID' })
    findOne(@Param('id') id: string) {
        return this.blogsService.findOne(id);
    }

    @Get('slug/:slug')
    @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: 'Get blog by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.blogsService.findBySlug(slug);
    }

    @Post(':id/view')
    @ApiOperation({ summary: 'Increment view count' })
    incrementView(@Param('id') id: string) {
        return this.blogsService.incrementViews(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a blog post' })
    update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(id, updateBlogDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a blog post' })
    remove(@Param('id') id: string) {
        return this.blogsService.remove(id);
    }
}
