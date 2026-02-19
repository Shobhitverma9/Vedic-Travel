import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    priceOriginal?: number;

    @ApiProperty({ required: false, default: 'Land Only' })
    @IsString()
    @IsOptional()
    packageType?: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    duration: number;

    @ApiProperty({ type: [String] })
    @IsArray()
    locations: string[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    slideshowImages?: string[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    placesToVisit?: string;

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    placesHighlights?: string[];

    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    itinerary?: any[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    packageIncludes?: string[];

    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    hotels?: any[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    inclusions?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    exclusions?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    dos?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    donts?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    thingsToCarry?: string[];

    @ApiProperty()
    @IsNumber()
    @Min(1)
    maxGroupSize: number;

    @ApiProperty({ type: [Date], required: false })
    @IsArray()
    @IsOptional()
    availableDates?: Date[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    destination?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    highlights?: any;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    isFavorite?: boolean;

    @ApiProperty({ required: false, default: 'standard' })
    @IsOptional()
    favoriteSize?: string;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    isTrending?: boolean;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    trendingRank?: number;
}
