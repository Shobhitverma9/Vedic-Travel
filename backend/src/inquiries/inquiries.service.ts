import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
    constructor(@InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>) { }

    async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const createdInquiry = new this.inquiryModel(createInquiryDto);
        return createdInquiry.save();
    }

    async findAll(): Promise<Inquiry[]> {
        return this.inquiryModel.find().sort({ createdAt: -1 }).exec();
    }
}
