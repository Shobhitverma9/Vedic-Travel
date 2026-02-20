import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { YatrasService } from './yatras.service';

@Controller('yatras')
export class YatrasController {
    constructor(private readonly yatrasService: YatrasService) { }

    @Post()
    create(@Body() createYatraDto: any) {
        return this.yatrasService.create(createYatraDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    findAll(@Query() query: any) {
        return this.yatrasService.findAll(query);
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    findOne(@Param('id') id: string) {
        return this.yatrasService.findOne(id);
    }

    @Get('slug/:slug')
    @UseInterceptors(CacheInterceptor)
    findBySlug(@Param('slug') slug: string) {
        return this.yatrasService.findBySlug(slug);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateYatraDto: any) {
        return this.yatrasService.update(id, updateYatraDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.yatrasService.remove(id);
    }
}
