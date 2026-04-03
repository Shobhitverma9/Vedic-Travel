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
            useFactory: async (configService: ConfigService) => {
                const expiresInConfig = configService.get<string>('JWT_EXPIRATION') || '7d';
                
                // Robust parsing of expiresIn
                let expiresIn: string | number = expiresInConfig;
                if (typeof expiresIn === 'string') {
                    expiresIn = expiresIn.trim();
                    // If it's a numeric string, convert to number
                    if (/^\d+$/.test(expiresIn)) {
                        expiresIn = parseInt(expiresIn, 10);
                    }
                }
                
                // Final check to ensure it's not an empty string or null
                if (!expiresIn) {
                    expiresIn = '7d';
                }

                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn,
                    },
                };
            },
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
