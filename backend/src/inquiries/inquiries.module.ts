import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { Inquiry, InquirySchema } from './schemas/inquiry.schema';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Inquiry.name, schema: InquirySchema }]),
        ConfigModule,
        EmailModule,
    ],
    controllers: [InquiriesController],
    providers: [InquiriesService],
})
export class InquiriesModule { }
