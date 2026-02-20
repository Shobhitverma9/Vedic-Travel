import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
        BookingsModule,
        EmailModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
