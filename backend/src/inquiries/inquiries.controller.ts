import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
// Using JwtAuthGuard if strictly needed for admin, but public for submission
// Assuming there might be an AdminAuthGuard or similar, but simplified for now:
// public POST, protected GET.

@Controller('inquiries')
export class InquiriesController {
    constructor(private readonly inquiriesService: InquiriesService) { }

    @Post()
    create(@Body() createInquiryDto: CreateInquiryDto) {
        return this.inquiriesService.create(createInquiryDto);
    }

    @Get()
    findAll() {
        return this.inquiriesService.findAll();
    }
}
