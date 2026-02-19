import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';
import { OTP, OTPSchema } from './schemas/otp.schema';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { OTPService } from './services/otp.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
                },
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: OTP.name, schema: OTPSchema },
        ]),
        ScheduleModule.forRoot(),
        UsersModule,
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, OTPService, JwtStrategy, GoogleStrategy, LocalStrategy],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
