import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseInterceptors, Inject } from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { YatrasService } from './yatras.service';

@Controller('yatras')
export class YatrasController {
    constructor(
        private readonly yatrasService: YatrasService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @Post()
    async create(@Body() createYatraDto: any) {
        const yatra = await this.yatrasService.create(createYatraDto);
        await this.cacheManager.reset();
        return yatra;
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    findAll(@Query() query: any) {
        return this.yatrasService.findAll(query);
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    findOne(@Param('id') id: string, @Query() query: any) {
        return this.yatrasService.findOne(id, query);
    }

    @Get('slug/:slug')
    @UseInterceptors(CacheInterceptor)
    findBySlug(@Param('slug') slug: string) {
        return this.yatrasService.findBySlug(slug);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateYatraDto: any) {
        const yatra = await this.yatrasService.update(id, updateYatraDto);
        await this.cacheManager.reset();
        return yatra;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.yatrasService.remove(id);
        await this.cacheManager.reset();
        return result;
    }
}
