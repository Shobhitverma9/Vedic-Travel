import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { SendLoginOTPDto } from './dto/send-login-otp.dto';
import { LoginWithOTPDto } from './dto/login-otp.dto';
import { OTPService } from './services/otp.service';
import { OTPType, OTPPurpose } from './schemas/otp.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private otpService: OTPService,
        private emailService: EmailService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, name, phone } = registerDto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new UnauthorizedException('Email already registered');
        }

        // Create user
        const user = await this.userModel.create({
            email,
            password,
            name,
            phone,
        });

        // Generate token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    /**
     * Send OTP for registration
     */
    async sendRegistrationOTP(sendOTPDto: SendOTPDto) {
        const { email, phone, name } = sendOTPDto;

        // Check if user already exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }

        // Send email OTP
        const emailResult = await this.otpService.createEmailOTP(
            email,
            OTPPurpose.REGISTRATION,
            name,
        );

        // Send phone OTP if provided
        let phoneResult;
        if (phone) {
            phoneResult = await this.otpService.createPhoneOTP(
                phone,
                OTPPurpose.REGISTRATION,
            );
        }

        return {
            message: 'OTP sent successfully',
            email: {
                sent: true,
                expiresAt: emailResult.expiresAt,
            },
            phone: phone ? {
                sent: true,
                expiresAt: phoneResult.expiresAt,
            } : null,
        };
    }

    /**
     * Verify OTP and create account
     */
    async verifyAndRegister(verifyOTPDto: VerifyOTPDto) {
        const { email, emailOtp, phone, phoneOtp, name, password } = verifyOTPDto;

        // Verify email OTP (required)
        await this.otpService.verifyOTP(
            email,
            OTPType.EMAIL,
            OTPPurpose.REGISTRATION,
            emailOtp,
        );

        // Verify phone OTP if provided
        if (phone && phoneOtp) {
            await this.otpService.verifyOTP(
                phone,
                OTPType.PHONE,
                OTPPurpose.REGISTRATION,
                phoneOtp,
            );
        }

        // Check if user already exists (double-check)
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }

        // Create user with verified status
        const user = await this.userModel.create({
            email,
            password,
            name,
            phone,
            emailVerified: true,
            phoneVerified: phone && phoneOtp ? true : false,
            verifiedAt: new Date(),
        });

        // Cleanup OTPs
        await this.otpService.cleanupAfterRegistration(email, phone);

        // Send welcome email
        try {
            await this.emailService.sendWelcomeEmail(email, name);
        } catch (error) {
            // Don't fail registration if welcome email fails
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
            message: 'Registration successful! Welcome to VedicTravel.',
        };
    }

    /**
     * Resend OTP
     */
    async resendOTP(resendOTPDto: ResendOTPDto) {
        const { email, phone, name, purpose } = resendOTPDto;

        const otpPurpose = purpose === 'registration'
            ? OTPPurpose.REGISTRATION
            : OTPPurpose.LOGIN;

        // Send email OTP
        const emailResult = await this.otpService.createEmailOTP(
            email,
            otpPurpose,
            name,
        );

        // Send phone OTP if provided
        let phoneResult;
        if (phone) {
            phoneResult = await this.otpService.createPhoneOTP(
                phone,
                otpPurpose,
            );
        }

        return {
            message: 'OTP resent successfully',
            email: {
                sent: true,
                expiresAt: emailResult.expiresAt,
            },
            phone: phone ? {
                sent: true,
                expiresAt: phoneResult.expiresAt,
            } : null,
        };
    }

    /**
     * Send OTP for login
     */
    async sendLoginOTP(sendLoginOTPDto: SendLoginOTPDto) {
        const { email } = sendLoginOTPDto;

        // Check if user exists
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Send email OTP
        const result = await this.otpService.createEmailOTP(
            email,
            OTPPurpose.LOGIN,
            user.name,
        );

        return {
            message: 'Login OTP sent successfully',
            expiresAt: result.expiresAt,
        };
    }

    /**
     * Login with OTP
     */
    async loginWithOTP(loginWithOTPDto: LoginWithOTPDto) {
        const { email, otp } = loginWithOTPDto;

        // Find user
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Verify OTP
        await this.otpService.verifyOTP(
            email,
            OTPType.EMAIL,
            OTPPurpose.LOGIN,
            otp,
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check password
        const isPasswordValid = await (user as any).comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async googleLogin(profile: any) {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;

        // Find or create user
        let user = await this.userModel.findOne({ googleId: id });

        if (!user) {
            // Check if email exists
            user = await this.userModel.findOne({ email });

            if (user) {
                // Link Google account
                user.googleId = id;
                user.avatar = photos?.[0]?.value;
                user.emailVerified = true; // Google accounts are verified
                if (!user.verifiedAt) {
                    user.verifiedAt = new Date();
                }
                await user.save();
            } else {
                // Create new user
                user = await this.userModel.create({
                    googleId: id,
                    email,
                    name: displayName,
                    avatar: photos?.[0]?.value,
                    emailVerified: true,
                    verifiedAt: new Date(),
                });

                // Send welcome email
                try {
                    await this.emailService.sendWelcomeEmail(email, displayName);
                } catch (error) {
                    // Don't fail if welcome email fails
                }
            }
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async validateUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }
        return user;
    }

    private generateToken(user: UserDocument) {
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }

    private sanitizeUser(user: UserDocument) {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }
}
