import {
  IsString,
  IsNumber,
  IsDate,
  IsArray,
  IsOptional,
  Min,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class AddressDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressLine: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pincode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gst?: string;
}

class TravelerDetailDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  age: number;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsString()
  idProof: string;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  tourId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  numberOfTravelers: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  travelDate: Date;

  @ApiProperty({ type: [TravelerDetailDto] })
  @IsArray()
  travelerDetails: TravelerDetailDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDetailDto)
  billingAddress?: AddressDetailDto;

  @IsOptional()
  @IsString()
  departureCity?: string;

  @IsOptional()
  @IsNumber()
  citySurcharge?: number;
}
