import { IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';

export class AddToCartDto {
    @IsNotEmpty()
    tourId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsDateString()
    travelDate: string;
}
