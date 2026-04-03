import { IsString, IsArray, IsOptional, IsBoolean, IsDateString, IsObject, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    excerpt?: string;

    @ApiProperty({
        description: 'Editor.js JSON content object, or legacy HTML string',
        required: false,
    })
    @IsOptional()
    content?: any;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    featuredImage?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    author?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ required: false, enum: ['draft', 'published'], default: 'draft' })
    @IsEnum(['draft', 'published'])
    @IsOptional()
    status?: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    publishedDate?: Date;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    publishedAt?: Date;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
}
