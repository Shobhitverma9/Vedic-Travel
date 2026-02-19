import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstagramPost, InstagramPostSchema } from './schemas/instagram-post.schema';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: InstagramPost.name, schema: InstagramPostSchema },
        ]),
    ],
    controllers: [InstagramController],
    providers: [InstagramService],
    exports: [InstagramService],
})
export class InstagramModule { }
