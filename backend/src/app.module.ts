import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ToursModule } from './tours/tours.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { FilesModule } from './files/files.module';
import { SettingsModule } from './settings/settings.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { YatrasModule } from './yatras/yatras.module';
import { InstagramModule } from './instagram/instagram.module';
import { BlogsModule } from './blogs/blogs.module';
import { CartModule } from './cart/cart.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),

        // Feature modules
        AuthModule,
        UsersModule,
        ToursModule,
        BookingsModule,
        PaymentsModule,
        AdminModule,
        FilesModule,
        SettingsModule,
        InquiriesModule,
        YatrasModule,
        InstagramModule,
        BlogsModule,
        CartModule,
    ],
})
export class AppModule { }
