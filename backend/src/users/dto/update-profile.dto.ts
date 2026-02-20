import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ required: false, enum: ['Male', 'Female', 'Other'] })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    dateOfBirth?: Date;

    @ApiProperty({ required: false, enum: ['Single', 'Married', 'Divorced', 'Widowed'] })
    @IsOptional()
    @IsString()
    maritalStatus?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    travellers?: any[];
}
