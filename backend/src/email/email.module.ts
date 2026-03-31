import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';
import { EmailSchedulerService } from './email-scheduler.service';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Tour, TourSchema } from '../tours/schemas/tour.schema';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: Booking.name, schema: BookingSchema },
            { name: Tour.name, schema: TourSchema },
        ]),
    ],
    providers: [EmailService, EmailSchedulerService],
    exports: [EmailService],
})
export class EmailModule { }
