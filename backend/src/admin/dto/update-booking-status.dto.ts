import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../bookings/schemas/booking.schema';

export class UpdateBookingStatusDto {
    @ApiProperty({ enum: BookingStatus })
    @IsEnum(BookingStatus)
    status: BookingStatus;
}
