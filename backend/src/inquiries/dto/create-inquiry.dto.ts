import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateInquiryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

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
    message?: string;

    @IsString()
    @IsOptional()
    tourId?: string;

    @IsString()
    @IsOptional()
    tourName?: string;

    @IsBoolean()
    @IsOptional()
    isCorporate?: boolean;

    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    officeAddress?: string;

    @IsString()
    @IsOptional()
    teamSize?: string;

    @IsString()
    @IsOptional()
    journeyDate?: string;

    @IsString()
    @IsOptional()
    budget?: string;

    @IsBoolean()
    @IsOptional()
    isCustomizable?: boolean;

    @IsString()
    @IsOptional()
    duration?: string;

    @IsString()
    @IsNotEmpty()
    recaptchaToken: string;
}
