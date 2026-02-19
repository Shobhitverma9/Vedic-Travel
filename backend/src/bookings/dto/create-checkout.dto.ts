import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class TravelerDetailDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
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
    @IsString()
    email: string;
}
