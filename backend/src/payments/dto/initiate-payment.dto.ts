import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
    @ApiProperty()
    @IsString()
    bookingId: string;
}
