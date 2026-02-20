import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Yatra, YatraSchema } from './schemas/yatra.schema';
import { YatrasController } from './yatras.controller';
import { YatrasService } from './yatras.service';
import { ToursModule } from '../tours/tours.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Yatra.name, schema: YatraSchema }]),
        ToursModule
    ],
    controllers: [YatrasController],
    providers: [YatrasService],
    exports: [YatrasService],
})
export class YatrasModule { }
