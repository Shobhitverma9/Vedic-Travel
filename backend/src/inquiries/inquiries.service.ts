import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class InquiriesService {
    constructor(
        @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
        private emailService: EmailService,
        private configService: ConfigService,
    ) { }

    async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const createdInquiry = new this.inquiryModel(createInquiryDto);
        const savedInquiry = await createdInquiry.save();

        // Send notification emails (asynchronously)
        this.emailService.sendInquiryAcknowledgementEmail(
            savedInquiry.email,
            savedInquiry.name,
            {
                tourName: savedInquiry.tourName,
                yatraName: savedInquiry.yatraName,
                adults: savedInquiry.adults,
                children: savedInquiry.children,
                infants: savedInquiry.infants,
                message: savedInquiry.message,
            }
        ).catch(err => console.error('Failed to send acknowledgement email:', err));

        const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@vedictravel.com';
        this.emailService.sendAdminInquiryNotificationEmail(
            adminEmail,
            {
                name: savedInquiry.name,
                email: savedInquiry.email,
                mobile: savedInquiry.mobile,
                tourName: savedInquiry.tourName,
                yatraName: savedInquiry.yatraName,
                adults: savedInquiry.adults,
                children: savedInquiry.children,
                infants: savedInquiry.infants,
                message: savedInquiry.message,
            }
        ).catch(err => console.error('Failed to send admin notification email:', err));

        return savedInquiry;
    }

    async findAll(): Promise<Inquiry[]> {
        return this.inquiryModel.find().sort({ createdAt: -1 }).exec();
    }
}
