import { IsString, IsNumber, IsDate, IsArray, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TravelerDetailDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    age: number;

    @ApiProperty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsString()
    idProof: string;
}

export class CreateBookingDto {
    @ApiProperty()
    @IsString()
    tourId: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    numberOfTravelers: number;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    travelDate: Date;

    @ApiProperty({ type: [TravelerDetailDto] })
    @IsArray()
    travelerDetails: TravelerDetailDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    specialRequests?: string;
}
