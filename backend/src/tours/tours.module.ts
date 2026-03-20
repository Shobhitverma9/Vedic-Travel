import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour, TourSchema } from './schemas/tour.schema';
import { Yatra, YatraSchema } from '../yatras/schemas/yatra.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Tour.name, schema: TourSchema },
            { name: Yatra.name, schema: YatraSchema }
        ]),
    ],
    controllers: [ToursController],
    providers: [ToursService],
    exports: [ToursService],
})
export class ToursModule { }
