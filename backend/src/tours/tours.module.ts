import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour, TourSchema } from './schemas/tour.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    ],
    controllers: [ToursController],
    providers: [ToursService],
    exports: [ToursService],
})
export class ToursModule { }
