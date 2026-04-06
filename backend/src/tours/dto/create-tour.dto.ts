import { IsString, IsNumber, IsArray, IsOptional, Min, ValidateNested, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DepartureCityDto {
    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    surcharge?: number;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;

    @ApiProperty({ required: false, enum: ['specific_dates', 'weekly', 'daily', 'monthly_dates'] })
    @IsEnum(['specific_dates', 'weekly', 'daily', 'monthly_dates'])
    @IsOptional()
    availabilityType?: string;

    @ApiProperty({ type: [Date], required: false })
    @IsArray()
    @IsOptional()
    @Type(() => Date)
    availableDates?: Date[];

    @ApiProperty({ type: [Number], required: false })
    @IsArray()
    @IsOptional()
    weeklyDays?: number[];

    @ApiProperty({ type: [Number], required: false })
    @IsArray()
    @IsOptional()
    monthlyDays?: number[];

    @ApiProperty({ type: [Date], required: false })
    @IsArray()
    @IsOptional()
    @Type(() => Date)
    blackoutDates?: Date[];
}

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
    @IsString()
    @IsOptional()
    cancellationPolicy?: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    useDefaultCancellationPolicy?: boolean;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    termsAndConditions?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    paymentTerms?: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    hasEasyCancellation?: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    hasEasyVisa?: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    hasHighSeason?: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    hasTravelValidity?: boolean;

    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    customBlocks?: any[];

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
    @IsBoolean()
    @IsOptional()
    isFavorite?: boolean;

    @ApiProperty({ required: false, default: 'standard' })
    @IsString()
    @IsOptional()
    favoriteSize?: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ required: false, default: false })
    @IsBoolean()
    @IsOptional()
    isTrending?: boolean;

    @ApiProperty({ required: false, default: 0 })
    @IsNumber()
    @IsOptional()
    trendingRank?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    badge?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    emiStartingFrom?: number;

    @ApiProperty({ type: [DepartureCityDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DepartureCityDto)
    @IsOptional()
    departureCities?: DepartureCityDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}
