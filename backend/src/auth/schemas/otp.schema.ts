import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type OTPDocument = OTP & Document;

export enum OTPType {
    EMAIL = 'email',
    PHONE = 'phone',
}

export enum OTPPurpose {
    REGISTRATION = 'registration',
    LOGIN = 'login',
    PASSWORD_RESET = 'password_reset',
}

@Schema({ timestamps: true })
export class OTP {
    @Prop({ required: true })
    identifier: string; // email or phone number

    @Prop({ required: true, enum: OTPType })
    type: OTPType;

    @Prop({ required: true, enum: OTPPurpose })
    purpose: OTPPurpose;

    @Prop({ required: true })
    otp: string; // hashed OTP

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    verified: boolean;

    @Prop({ default: 0 })
    attempts: number;

    @Prop()
    verifiedAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

// Hash OTP before saving
OTPSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();

    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
});

// Method to compare OTPs
OTPSchema.methods.compareOTP = async function (
    candidateOTP: string,
): Promise<boolean> {
    return bcrypt.compare(candidateOTP, this.otp);
};

// Indexes for performance
OTPSchema.index({ identifier: 1, type: 1, purpose: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
