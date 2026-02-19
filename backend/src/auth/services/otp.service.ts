import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OTP, OTPDocument, OTPType, OTPPurpose } from '../schemas/otp.schema';
import { EmailService } from '../../email/email.service';

@Injectable()
export class OTPService {
    private readonly logger = new Logger(OTPService.name);
    private readonly OTP_LENGTH = 6;
    private readonly OTP_EXPIRY_MINUTES = 10;
    private readonly MAX_ATTEMPTS = 5;
    private readonly RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes
    private readonly MAX_OTP_PER_WINDOW = 3;

    constructor(
        @InjectModel(OTP.name) private otpModel: Model<OTPDocument>,
        private emailService: EmailService,
    ) { }

    /**
     * Generate a random 6-digit OTP
     */
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Check rate limiting for OTP requests
     */
    private async checkRateLimit(identifier: string, type: OTPType, purpose: OTPPurpose): Promise<void> {
        const windowStart = new Date(Date.now() - this.RATE_LIMIT_WINDOW);

        const recentOTPs = await this.otpModel.countDocuments({
            identifier,
            type,
            purpose,
            createdAt: { $gte: windowStart },
        });

        if (recentOTPs >= this.MAX_OTP_PER_WINDOW) {
            throw new BadRequestException(
                `Too many OTP requests. Please try again in 30 minutes.`
            );
        }
    }

    /**
     * Create and send OTP for email
     */
    async createEmailOTP(
        email: string,
        purpose: OTPPurpose,
        userName?: string,
    ): Promise<{ success: boolean; expiresAt: Date }> {
        await this.checkRateLimit(email, OTPType.EMAIL, purpose);

        // Invalidate any existing OTPs for this identifier
        await this.otpModel.updateMany(
            {
                identifier: email,
                type: OTPType.EMAIL,
                purpose,
                verified: false,
            },
            { expiresAt: new Date() }
        );

        // Generate new OTP
        const otpCode = this.generateOTP();
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        // Save to database
        const otpDoc = await this.otpModel.create({
            identifier: email,
            type: OTPType.EMAIL,
            purpose,
            otp: otpCode,
            expiresAt,
        });

        // Send email based on purpose
        try {
            if (purpose === OTPPurpose.REGISTRATION) {
                await this.emailService.sendOTPEmail(email, otpCode, userName || 'User');
            } else if (purpose === OTPPurpose.LOGIN) {
                await this.emailService.sendLoginOTPEmail(email, otpCode, userName || 'User');
            }

            this.logger.log(`OTP sent to email: ${email} for purpose: ${purpose}`);
        } catch (error) {
            this.logger.error(`Failed to send OTP email to ${email}:`, error);
            // Continue anyway - OTP is saved in DB
        }

        return {
            success: true,
            expiresAt,
        };
    }

    /**
     * Create OTP for phone (mock - logs to console)
     */
    async createPhoneOTP(
        phone: string,
        purpose: OTPPurpose,
    ): Promise<{ success: boolean; expiresAt: Date }> {
        await this.checkRateLimit(phone, OTPType.PHONE, purpose);

        // Invalidate any existing OTPs for this identifier
        await this.otpModel.updateMany(
            {
                identifier: phone,
                type: OTPType.PHONE,
                purpose,
                verified: false,
            },
            { expiresAt: new Date() }
        );

        // Generate new OTP
        const otpCode = this.generateOTP();
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        // Save to database
        await this.otpModel.create({
            identifier: phone,
            type: OTPType.PHONE,
            purpose,
            otp: otpCode,
            expiresAt,
        });

        // Mock SMS - log to console
        this.logger.log(`[MOCK SMS] Phone: ${phone}`);
        this.logger.log(`[MOCK SMS] OTP Code: ${otpCode}`);
        this.logger.log(`[MOCK SMS] Purpose: ${purpose}`);
        this.logger.log(`[MOCK SMS] Message: Your VedicTravel OTP is ${otpCode}. Valid for ${this.OTP_EXPIRY_MINUTES} minutes.`);

        return {
            success: true,
            expiresAt,
        };
    }

    /**
     * Verify OTP code
     */
    async verifyOTP(
        identifier: string,
        type: OTPType,
        purpose: OTPPurpose,
        otpCode: string,
    ): Promise<boolean> {
        // Find the most recent non-expired, non-verified OTP
        const otpDoc = await this.otpModel.findOne({
            identifier,
            type,
            purpose,
            verified: false,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        if (!otpDoc) {
            throw new BadRequestException('OTP not found or expired');
        }

        // Check attempts
        if (otpDoc.attempts >= this.MAX_ATTEMPTS) {
            throw new BadRequestException('Maximum verification attempts exceeded');
        }

        // Increment attempts
        otpDoc.attempts += 1;
        await otpDoc.save();

        // Verify OTP
        const isValid = await (otpDoc as any).compareOTP(otpCode);

        if (!isValid) {
            const remainingAttempts = this.MAX_ATTEMPTS - otpDoc.attempts;
            if (remainingAttempts > 0) {
                throw new BadRequestException(
                    `Invalid OTP. ${remainingAttempts} attempts remaining.`
                );
            } else {
                throw new BadRequestException('Maximum verification attempts exceeded');
            }
        }

        // Mark as verified
        otpDoc.verified = true;
        otpDoc.verifiedAt = new Date();
        await otpDoc.save();

        this.logger.log(`OTP verified for ${type}: ${identifier}`);
        return true;
    }

    /**
     * Check if an identifier has a verified OTP
     */
    async isVerified(
        identifier: string,
        type: OTPType,
        purpose: OTPPurpose,
    ): Promise<boolean> {
        const verifiedOTP = await this.otpModel.findOne({
            identifier,
            type,
            purpose,
            verified: true,
            expiresAt: { $gt: new Date() },
        });

        return !!verifiedOTP;
    }

    /**
     * Cleanup expired OTPs (runs every hour)
     */
    @Cron(CronExpression.EVERY_HOUR)
    async cleanupExpiredOTPs(): Promise<void> {
        const result = await this.otpModel.deleteMany({
            expiresAt: { $lt: new Date() },
        });

        if (result.deletedCount > 0) {
            this.logger.log(`Cleaned up ${result.deletedCount} expired OTPs`);
        }
    }

    /**
     * Delete OTPs for an identifier after successful registration
     */
    async cleanupAfterRegistration(email: string, phone?: string): Promise<void> {
        await this.otpModel.deleteMany({
            $or: [
                { identifier: email, type: OTPType.EMAIL },
                ...(phone ? [{ identifier: phone, type: OTPType.PHONE }] : []),
            ],
            purpose: OTPPurpose.REGISTRATION,
        });

        this.logger.log(`Cleaned up registration OTPs for ${email}`);
    }
}
