import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { EmailService } from '../email/email.service';
import axios from 'axios';

@Injectable()
export class InquiriesService {
    constructor(
        @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
        private emailService: EmailService,
        private configService: ConfigService,
    ) { }

    private async verifyRecaptcha(token: string): Promise<boolean> {
        const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
        
        if (!secretKey) {
            console.warn('RECAPTCHA_SECRET_KEY is not defined. Skipping verification in development mode.');
            return true; // Skip if no key (for dev)
        }

        try {
            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
            );
            return response.data.success;
        } catch (error) {
            console.error('reCAPTCHA verification error:', error);
            return false;
        }
    }

    async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const { recaptchaToken, ...inquiryData } = createInquiryDto;

        const isValid = await this.verifyRecaptcha(recaptchaToken);
        if (!isValid) {
            throw new BadRequestException('reCAPTCHA verification failed. Please try again.');
        }

        const createdInquiry = new this.inquiryModel(inquiryData);
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
