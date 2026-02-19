import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Tour, TourSchema } from '../tours/schemas/tour.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { UsersModule } from '../users/users.module';
import { ToursModule } from '../tours/tours.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Tour.name, schema: TourSchema },
            { name: Booking.name, schema: BookingSchema },
        ]),
        UsersModule,
        ToursModule,
        BookingsModule,
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
