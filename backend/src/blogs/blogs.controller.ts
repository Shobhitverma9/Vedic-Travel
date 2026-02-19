import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

    @Get()
    @ApiOperation({ summary: 'Get all blogs' })
    findAll(@Query('limit') limit?: number) {
        return this.blogsService.findAll(limit);
    }

    @Get('admin')
    @ApiOperation({ summary: 'Get all blogs for admin (includes inactive)' })
    findAllAdmin() {
        return this.blogsService.findAllAdmin();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get blog by ID' })
    findOne(@Param('id') id: string) {
        return this.blogsService.findOne(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get blog by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.blogsService.findBySlug(slug);
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
