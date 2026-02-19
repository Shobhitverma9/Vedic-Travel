import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstagramPostDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    caption?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    videoUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    thumbnailUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    instagramLink: string;

    @ApiProperty({ required: false, default: 0 })
    @IsNumber()
    @IsOptional()
    views?: number;

    @ApiProperty({ required: false, default: 0 })
    @IsNumber()
    @IsOptional()
    order?: number;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
