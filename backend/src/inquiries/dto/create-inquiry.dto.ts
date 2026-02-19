import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInquiryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    mobile: string;

    @IsOptional()
    adults?: number;

    @IsOptional()
    children?: number;

    @IsOptional()
    infants?: number;

    @IsString()
    @IsOptional()
    message: string;

    @IsString()
    @IsOptional()
    tourId?: string;

    @IsString()
    @IsOptional()
    tourName?: string;
}
