import { IsString, IsArray, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    excerpt: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsString()
    image: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    publishedDate?: Date;
}
