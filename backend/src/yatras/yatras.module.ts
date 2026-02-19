import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Yatra, YatraSchema } from './schemas/yatra.schema';
import { YatrasController } from './yatras.controller';
import { YatrasService } from './yatras.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Yatra.name, schema: YatraSchema }])
    ],
    controllers: [YatrasController],
    providers: [YatrasService],
    exports: [YatrasService],
})
export class YatrasModule { }
