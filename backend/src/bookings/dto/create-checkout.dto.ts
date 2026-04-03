import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDetailDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    addressLine: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    pincode: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    mobile: string;

    @IsOptional()
    @IsString()
    gst?: string;
}

class TravelerDetailDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @IsString()
    gender: string;

    @IsNotEmpty()
    @IsString()
    idProof: string;
}

export class CreateCheckoutDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TravelerDetailDto)
    travelerDetails: TravelerDetailDto[];

    @IsOptional()
    @IsString()
    specialRequests?: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AddressDetailDto)
    billingAddress: AddressDetailDto;
}
