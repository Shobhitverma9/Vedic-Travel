import { IsNotEmpty, IsArray, ValidateNested, IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GuestCartItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tourId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    travelDate: Date;
}

class GuestTravelerDetailDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    age: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    idProof: string;
}

export class CreateGuestBookingDto {
    @ApiProperty({ type: [GuestCartItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GuestCartItemDto)
    items: GuestCartItemDto[];

    @ApiProperty({ type: [GuestTravelerDetailDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GuestTravelerDetailDto)
    travelerDetails: GuestTravelerDetailDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    specialRequests?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;
}
