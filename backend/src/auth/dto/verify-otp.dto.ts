import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOTPDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', required: false })
    @IsOptional()
    @IsString()
    @MinLength(6)
    emailOtp?: string;

    @ApiProperty({ example: '+919876543210', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: '123456', required: false })
    @IsOptional()
    @IsString()
    @MinLength(6)
    phoneOtp?: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(6)
    password: string;
}
