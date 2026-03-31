import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
    private client: postmark.ServerClient;
    private fromEmail: string;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('POSTMARK_API_KEY');
        this.fromEmail = this.configService.get<string>('POSTMARK_FROM_EMAIL') || 'noreply@vedictravel.com';

        if (!apiKey) {
            this.logger.warn('POSTMARK_API_KEY not configured. Email sending will be logged to console only.');
        } else {
            this.client = new postmark.ServerClient(apiKey);
        }
    }

    async sendOTPEmail(email: string, otp: string, name: string): Promise<void> {
        const subject = 'Verify Your VedicTravel Account';
        const htmlBody = this.getOTPEmailTemplate(otp, name);
        const textBody = `Hello ${name},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nVedicTravel Team`;

        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendLoginOTPEmail(email: string, otp: string, name: string): Promise<void> {
        const subject = 'Your VedicTravel Login Code';
        const htmlBody = this.getLoginOTPEmailTemplate(otp, name);
        const textBody = `Hello ${name},\n\nYour login OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please secure your account immediately.\n\nBest regards,\nVedicTravel Team`;

        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        const subject = 'Welcome to VedicTravel - Your Spiritual Journey Begins';
        const htmlBody = this.getWelcomeEmailTemplate(name);
        const textBody = `Welcome to VedicTravel, ${name}!\n\nThank you for joining us on your spiritual journey. We're excited to help you explore sacred destinations and meaningful experiences.\n\nBest regards,\nVedicTravel Team`;

        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendBookingConfirmationEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            travelDate: string;
            numberOfTravelers: number;
            totalAmount: number;
            phone?: string;
        }
    ): Promise<void> {
        const subject = `Booking Confirmed 🎉 - ${details.bookingReference} | VedicTravel`;
        const htmlBody = this.getBookingConfirmationTemplate(name, details);
        const textBody = `Dear ${name},\n\nYour booking is confirmed!\n\nBooking Reference: ${details.bookingReference}\nTour: ${details.tourName}\nTravel Date: ${details.travelDate}\nTravellers: ${details.numberOfTravelers}\nTotal Amount: ₹${details.totalAmount.toLocaleString('en-IN')}\n\nThank you for booking with VedicTravel. We look forward to being a part of your spiritual journey.\n\nBest regards,\nVedicTravel Team`;

        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendBookingCancellationEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            travelDate: string;
            numberOfTravelers: number;
            totalAmount: number;
            cancellationReason?: string;
        }
    ): Promise<void> {
        const subject = `Booking Cancelled - ${details.bookingReference} | VedicTravel`;
        const htmlBody = this.getBookingCancellationTemplate(name, details);
        const textBody = `Dear ${name},\n\nYour booking ${details.bookingReference} for ${details.tourName} has been cancelled.\n\nIf you have any questions, please contact us.\n\nBest regards,\nVedicTravel Team`;
        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendInquiryAcknowledgementEmail(
        email: string,
        name: string,
        details: {
            tourName?: string;
            yatraName?: string;
            adults: number;
            children: number;
            infants: number;
            message?: string;
        }
    ): Promise<void> {
        const subject = `We Received Your Inquiry 🙏 | VedicTravel`;
        const htmlBody = this.getInquiryAcknowledgementTemplate(name, details);
        const textBody = `Dear ${name},\n\nThank you for your inquiry. We have received it and our team will reach out to you within 24 hours.\n\nBest regards,\nVedicTravel Team`;
        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendAdminInquiryNotificationEmail(
        adminEmail: string,
        details: {
            name: string;
            email: string;
            mobile: string;
            tourName?: string;
            yatraName?: string;
            adults: number;
            children: number;
            infants: number;
            message?: string;
        }
    ): Promise<void> {
        const subject = `🔔 New Inquiry from ${details.name} | VedicTravel Admin`;
        const htmlBody = this.getAdminInquiryNotificationTemplate(details);
        const textBody = `New inquiry from ${details.name} (${details.email}, ${details.mobile}).\n\nTour: ${details.tourName || details.yatraName || 'General'}\nMessage: ${details.message || 'None'}\n\nPlease respond within 24 hours.`;
        await this.sendEmail(adminEmail, subject, htmlBody, textBody);
    }

    async sendPaymentFailureEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            totalAmount: number;
            transactionId?: string;
        }
    ): Promise<void> {
        const subject = `Payment Failed - Action Required | VedicTravel`;
        const htmlBody = this.getPaymentFailureTemplate(name, details);
        const textBody = `Dear ${name},\n\nUnfortunately your payment for booking ${details.bookingReference} (${details.tourName}) of ₹${details.totalAmount.toLocaleString('en-IN')} could not be processed.\n\nPlease try again or contact us for help.\n\nBest regards,\nVedicTravel Team`;
        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendAdminNewBookingNotificationEmail(
        adminEmail: string,
        details: {
            bookingReference: string;
            customerName: string;
            customerEmail: string;
            customerPhone?: string;
            tourName: string;
            travelDate: string;
            numberOfTravelers: number;
            totalAmount: number;
            paymentId?: string;
        }
    ): Promise<void> {
        const subject = `🎉 New Booking Confirmed - ${details.bookingReference} | VedicTravel`;
        const htmlBody = this.getAdminNewBookingTemplate(details);
        const textBody = `New booking confirmed!\n\nRef: ${details.bookingReference}\nCustomer: ${details.customerName} (${details.customerEmail})\nTour: ${details.tourName}\nDate: ${details.travelDate}\nTravellers: ${details.numberOfTravelers}\nAmount: ₹${details.totalAmount.toLocaleString('en-IN')}`;
        await this.sendEmail(adminEmail, subject, htmlBody, textBody);
    }

    async sendTripReminderEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            travelDate: string;
            numberOfTravelers: number;
        }
    ): Promise<void> {
        const subject = `Your Sacred Journey Begins Soon! 🕉️ | VedicTravel`;
        const htmlBody = this.getTripReminderTemplate(name, details);
        const textBody = `Namaste ${name},\n\nYour trip to ${details.tourName} is just 3 days away! We're excited to have you join us. Please ensure you have all your travel documents ready.\n\nBest regards,\nVedicTravel Team`;
        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendPendingPaymentReminderEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            totalAmount: number;
        }
    ): Promise<void> {
        const subject = `Don't Miss Your Spot! ⏳ | VedicTravel`;
        const htmlBody = this.getPendingPaymentTemplate(name, details);
        const textBody = `Namaste ${name},\n\nWe noticed you didn't finish your booking for ${details.tourName}. Your spot is only held for a limited time. Please complete your payment to secure your pilgrimage.\n\nBest regards,\nVedicTravel Team`;
        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    async sendFeedbackRequestEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
        }
    ): Promise<void> {
        const subject = `How was your Journey? 🙏 | VedicTravel`;
        const htmlBody = this.getFeedbackRequestTemplate(name, details);
        const textBody = `Namaste ${name},\n\nWe hope you had a meaningful spiritual journey on your trip to ${details.tourName}. We'd love to hear your feedback to help us serve you better.\n\nBest regards,\nVedicTravel Team`;
        await this.sendEmail(email, subject, htmlBody, textBody);
    }

    private async sendEmail(to: string, subject: string, htmlBody: string, textBody: string): Promise<void> {
        try {
            if (!this.client) {
                // Mock mode - log to console
                this.logger.log(`[MOCK EMAIL] To: ${to}`);
                this.logger.log(`[MOCK EMAIL] Subject: ${subject}`);
                this.logger.log(`[MOCK EMAIL] Body: ${textBody}`);
                return;
            }

            await this.client.sendEmail({
                From: this.fromEmail,
                To: to,
                Subject: subject,
                HtmlBody: htmlBody,
                TextBody: textBody,
                MessageStream: 'outbound',
            });

            this.logger.log(`Email sent successfully to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}:`, error);
            throw new Error('Failed to send email');
        }
    }

    private getOTPEmailTemplate(otp: string, name: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #FFF8F3;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #FF5722 0%, #7B2CBF 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #1A2332;
            margin-bottom: 20px;
        }
        .otp-box {
            background: linear-gradient(135deg, #FFF8F3 0%, #FFE8E0 100%);
            border: 2px solid #FF5722;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #FF5722;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .expiry {
            margin-top: 15px;
            font-size: 14px;
            color: #7B2CBF;
        }
        .info {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-top: 20px;
        }
        .footer {
            background-color: #1A2332;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #FF5722;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕉️ VedicTravel</h1>
        </div>
        <div class="content">
            <div class="greeting">
                Hello ${name},
            </div>
            <p>Thank you for signing up with VedicTravel. To complete your registration, please use the OTP code below:</p>
            
            <div class="otp-box">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="expiry">⏱️ Expires in 10 minutes</div>
            </div>
            
            <p class="info">
                If you didn't request this code, please ignore this email. Your account security is important to us.
            </p>
            <p class="info">
                We're excited to help you begin your spiritual journey!
            </p>
        </div>
        <div class="footer">
            <p>© 2026 VedicTravel. All rights reserved.</p>
            <p>Begin your spiritual journey with us.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    private getLoginOTPEmailTemplate(otp: string, name: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #FFF8F3;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #7B2CBF 0%, #FF5722 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #1A2332;
            margin-bottom: 20px;
        }
        .otp-box {
            background: linear-gradient(135deg, #F3E8FF 0%, #FFE8E0 100%);
            border: 2px solid #7B2CBF;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #7B2CBF;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .expiry {
            margin-top: 15px;
            font-size: 14px;
            color: #FF5722;
        }
        .warning {
            background-color: #FFF3CD;
            border-left: 4px solid #FFA726;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background-color: #1A2332;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕉️ VedicTravel</h1>
        </div>
        <div class="content">
            <div class="greeting">
                Hello ${name},
            </div>
            <p>Someone requested a login code for your VedicTravel account. Use the code below to sign in:</p>
            
            <div class="otp-box">
                <div class="otp-label">Your Login Code</div>
                <div class="otp-code">${otp}</div>
                <div class="expiry">⏱️ Expires in 10 minutes</div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Alert:</strong> If you didn't request this code, please secure your account immediately by changing your password.
            </div>
            
            <p class="info">
                This code can only be used once and will expire in 10 minutes.
            </p>
        </div>
        <div class="footer">
            <p>© 2026 VedicTravel. All rights reserved.</p>
            <p>Your spiritual journey, secured.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    private getWelcomeEmailTemplate(name: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #FFF8F3;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #FF5722 0%, #7B2CBF 100%);
            padding: 50px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: bold;
        }
        .header p {
            color: #FFE8E0;
            margin: 0;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            color: #1A2332;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .message {
            color: #666;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 20px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
            color: #ffffff;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .features {
            background-color: #FFF8F3;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .feature {
            margin: 15px 0;
            display: flex;
            align-items: start;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 15px;
        }
        .feature-text {
            color: #1A2332;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background-color: #1A2332;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕉️ Welcome to VedicTravel!</h1>
            <p>Your spiritual journey begins here</p>
        </div>
        <div class="content">
            <div class="greeting">
                Namaste ${name},
            </div>
            <p class="message">
                We're thrilled to have you join the VedicTravel community! Your account has been successfully created, and you're now ready to explore sacred destinations and embark on meaningful spiritual journeys.
            </p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🛕</div>
                    <div class="feature-text">
                        <strong>Sacred Yatras:</strong> Discover authentic pilgrimage experiences to India's most revered temples and spiritual sites.
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🌄</div>
                    <div class="feature-text">
                        <strong>Curated Packages:</strong> Explore our handpicked tour packages designed for spiritual seekers and cultural enthusiasts.
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🧘</div>
                    <div class="feature-text">
                        <strong>Expert Guidance:</strong> Travel with experienced guides who understand the spiritual significance of each destination.
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">💫</div>
                    <div class="feature-text">
                        <strong>Personalized Support:</strong> Our team is here to help you plan your perfect spiritual journey.
                    </div>
                </div>
            </div>
            
            <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">
                    Start Your Journey
                </a>
            </center>
            
            <p class="message">
                If you have any questions or need assistance, our support team is always here to help.
            </p>
        </div>
        <div class="footer">
            <p><strong>VedicTravel</strong></p>
            <p>Connecting souls to sacred destinations</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    private getBookingConfirmationTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
        travelDate: string;
        numberOfTravelers: number;
        totalAmount: number;
    }): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #FFF8F3; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF5722 0%, #7B2CBF 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; }
        .header p { color: #FFE8E0; margin: 8px 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #1A2332; margin-bottom: 10px; font-weight: bold; }
        .subtitle { color: #666; margin-bottom: 30px; }
        .ref-box { background: linear-gradient(135deg,#FFF8F3 0%,#FFE8E0 100%); border: 2px solid #FF5722; border-radius: 12px; padding: 20px 30px; text-align: center; margin-bottom: 30px; }
        .ref-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .ref-value { font-size: 24px; font-weight: bold; color: #FF5722; letter-spacing: 3px; font-family: monospace; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .details-table td { padding: 14px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px; color: #444; }
        .details-table td:first-child { color: #999; width: 40%; }
        .details-table td:last-child { font-weight: 600; color: #1A2332; }
        .total-row td { border-bottom: none !important; font-size: 18px; padding-top: 20px; }
        .total-row td:last-child { color: #FF5722; font-size: 20px; }
        .cta { display: inline-block; background: linear-gradient(135deg,#FF5722 0%,#E64A19 100%); color: #fff; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0 20px; }
        .note { background: #f8f9fa; border-left: 4px solid #7B2CBF; padding: 15px 20px; border-radius: 4px; color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 30px; }
        .footer { background-color: #1A2332; color: #fff; padding: 24px 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕉️ Booking Confirmed!</h1>
            <p>Your sacred journey is officially booked</p>
        </div>
        <div class="content">
            <div class="greeting">Namaste, ${name}! 🙏</div>
            <p class="subtitle">We're thrilled to confirm your booking with VedicTravel. Here are your details:</p>
            <div class="ref-box">
                <div class="ref-label">Booking Reference</div>
                <div class="ref-value">${details.bookingReference}</div>
            </div>
            <table class="details-table">
                <tr><td>Tour / Yatra</td><td>${details.tourName}</td></tr>
                <tr><td>Travel Date</td><td>${details.travelDate}</td></tr>
                <tr><td>Travellers</td><td>${details.numberOfTravelers} Person(s)</td></tr>
                <tr class="total-row"><td>Total Paid</td><td>₹${details.totalAmount.toLocaleString('en-IN')}</td></tr>
            </table>
            <div class="note">
                <strong>What's next?</strong><br/>
                Our team will contact you within 24 hours with your travel itinerary and further details. Please keep your booking reference handy for any inquiries.
            </div>
            <center><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="cta">View My Booking</a></center>
        </div>
        <div class="footer">
            <p><strong>VedicTravel</strong> — Connecting souls to sacred destinations</p>
            <p style="margin-top:10px">© ${new Date().getFullYear()} VedicTravel. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    // ─── Booking Cancellation Template ──────────────────────────────────────────
    private getBookingCancellationTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
        travelDate: string;
        numberOfTravelers: number;
        totalAmount: number;
        cancellationReason?: string;
    }): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Cancelled</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#B71C1C 0%,#E53935 60%,#FF7043 100%);padding:48px 40px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:16px;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-block;line-height:64px;font-size:32px;">❌</div>
            </td></tr>
            <tr><td align="center">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Booking Cancelled</h1>
            </td></tr>
            <tr><td align="center" style="padding-top:8px;">
              <p style="color:rgba(255,255,255,0.85);margin:0;font-size:15px;">We're sorry to see you go</p>
            </td></tr>
          </table>
        </td>
      </tr>
      <!-- Booking Reference Banner -->
      <tr>
        <td style="background:#FFF3F3;padding:20px 40px;border-bottom:1px solid #FFE0E0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td><span style="font-size:12px;color:#B71C1C;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Cancellation Reference</span></td>
              <td align="right"><span style="font-size:18px;font-weight:700;color:#B71C1C;font-family:monospace;letter-spacing:2px;">${details.bookingReference}</span></td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:40px;">
          <p style="font-size:17px;color:#1A2332;margin:0 0 8px;font-weight:600;">Namaste ${name},</p>
          <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 32px;">Your booking has been successfully cancelled. We've processed the cancellation as per our policy and will notify you regarding any applicable refunds within 5–7 business days.</p>
          <!-- Details Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;border-radius:12px;border:1px solid #EBEBEB;overflow:hidden;margin-bottom:32px;">
            <tr><td style="background:#F5F5F5;padding:14px 20px;border-bottom:1px solid #EBEBEB;"><span style="font-size:13px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:1px;">Cancelled Booking Details</span></td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:13px;color:#999;">Tour / Yatra</span></td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:14px;font-weight:600;color:#1A2332;">${details.tourName}</span></td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:13px;color:#999;">Travel Date</span></td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:14px;font-weight:600;color:#1A2332;">${details.travelDate}</span></td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:13px;color:#999;">Travellers</span></td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:14px;font-weight:600;color:#1A2332;">${details.numberOfTravelers} Person(s)</span></td>
                </tr>
                <tr>
                  <td style="padding:10px 0;"><span style="font-size:13px;color:#999;">Amount</span></td>
                  <td align="right" style="padding:10px 0;"><span style="font-size:16px;font-weight:700;color:#B71C1C;">₹${details.totalAmount.toLocaleString('en-IN')}</span></td>
                </tr>
              </table>
            </td></tr>
          </table>
          ${details.cancellationReason ? `
          <!-- Reason -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF8E1;border-left:4px solid #FFA726;border-radius:4px;margin-bottom:32px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#E65100;font-weight:600;">Reason for Cancellation</p>
              <p style="margin:6px 0 0;font-size:14px;color:#555;line-height:1.6;">${details.cancellationReason}</p>
            </td></tr>
          </table>` : ''}
          <!-- Refund Note -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#E8F5E9 0%,#F1F8E9 100%);border-radius:12px;border:1px solid #C8E6C9;margin-bottom:32px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="36" valign="top"><div style="font-size:28px;line-height:1;">💰</div></td>
                  <td style="padding-left:12px;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#2E7D32;">Refund Information</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#555;line-height:1.6;">If eligible, your refund will be processed to the original payment method within 5–7 business days. You'll receive a separate email once processed.</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tours" style="display:inline-block;background:linear-gradient(135deg,#FF5722 0%,#E64A19 100%);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">Explore Other Tours</a>
          </td></tr></table>
        </td>
      </tr>
      <!-- Help Banner -->
      <tr>
        <td style="background:#FFF8F3;border-top:1px solid #FFE8E0;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td><p style="margin:0;font-size:13px;color:#666;">Need help? Contact our support team</p></td>
              <td align="right"><a href="mailto:support@vedictravel.in" style="font-size:13px;color:#FF5722;font-weight:600;text-decoration:none;">support@vedictravel.in</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#1A2332;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px;color:#ffffff;font-size:16px;font-weight:700;">🕉️ VedicTravel</p>
          <p style="margin:0 0 12px;color:rgba(255,255,255,0.5);font-size:12px;">Connecting souls to sacred destinations</p>
          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;">© ${new Date().getFullYear()} VedicTravel. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Inquiry Acknowledgement Template ───────────────────────────────────────
    private getInquiryAcknowledgementTemplate(name: string, details: {
        tourName?: string;
        yatraName?: string;
        adults: number;
        children: number;
        infants: number;
        message?: string;
    }): string {
        const tripName = details.tourName || details.yatraName || 'General Inquiry';
        const totalTravelers = (details.adults || 0) + (details.children || 0) + (details.infants || 0);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inquiry Received</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#FF5722 0%,#FF8C00 50%,#7B2CBF 100%);padding:48px 40px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:16px;">
              <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-block;line-height:72px;font-size:36px;">🙏</div>
            </td></tr>
            <tr><td align="center">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">We Got Your Inquiry!</h1>
            </td></tr>
            <tr><td align="center" style="padding-top:10px;">
              <p style="color:rgba(255,255,255,0.85);margin:0;font-size:15px;">Our travel experts are on it 🚀</p>
            </td></tr>
          </table>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:40px;">
          <p style="font-size:17px;color:#1A2332;margin:0 0 8px;font-weight:600;">Namaste ${name},</p>
          <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 32px;">Thank you for reaching out to VedicTravel! We have received your inquiry and our spiritual journey experts will connect with you within <strong style="color:#FF5722;">24 hours</strong> to craft your perfect pilgrimage experience.</p>
          <!-- Summary Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#FFF8F3 0%,#FFF3E8 100%);border-radius:12px;border:1px solid #FFE0CC;margin-bottom:32px;">
            <tr><td style="padding:20px 24px;border-bottom:1px solid #FFE0CC;">
              <span style="font-size:13px;font-weight:700;color:#FF5722;text-transform:uppercase;letter-spacing:1px;">Your Inquiry Summary</span>
            </td></tr>
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,93,0,0.1);"><span style="font-size:13px;color:#999;">🛕 Interested In</span></td>
                  <td align="right" style="padding:8px 0;border-bottom:1px solid rgba(255,93,0,0.1);"><span style="font-size:14px;font-weight:600;color:#1A2332;">${tripName}</span></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,93,0,0.1);"><span style="font-size:13px;color:#999;">👥 Travellers</span></td>
                  <td align="right" style="padding:8px 0;border-bottom:1px solid rgba(255,93,0,0.1);"><span style="font-size:14px;font-weight:600;color:#1A2332;">${totalTravelers} (Adults: ${details.adults}, Children: ${details.children}, Infants: ${details.infants})</span></td>
                </tr>
                ${details.message ? `<tr>
                  <td colspan="2" style="padding:10px 0 0;"><span style="font-size:13px;color:#999;">✉️ Your Message</span><br><span style="font-size:14px;color:#444;line-height:1.6;display:block;margin-top:4px;font-style:italic;">"${details.message}"</span></td>
                </tr>` : ''}
              </table>
            </td></tr>
          </table>
          <!-- Steps -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
            <tr><td style="padding-bottom:16px;"><span style="font-size:14px;font-weight:700;color:#1A2332;">What happens next?</span></td></tr>
            <tr><td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" width="36"><div style="width:28px;height:28px;background:linear-gradient(135deg,#FF5722,#FF8C00);border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:#fff;">1</div></td>
                  <td style="padding-left:12px;padding-bottom:16px;"><p style="margin:0;font-size:14px;color:#333;line-height:1.6;"><strong>Expert Review</strong> — Our travel specialists review your requirements and suggest the best itinerary.</p></td>
                </tr>
                <tr>
                  <td valign="top" width="36"><div style="width:28px;height:28px;background:linear-gradient(135deg,#FF8C00,#7B2CBF);border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:#fff;">2</div></td>
                  <td style="padding-left:12px;padding-bottom:16px;"><p style="margin:0;font-size:14px;color:#333;line-height:1.6;"><strong>Personal Call</strong> — We'll reach out to discuss your spiritual journey preferences, dates, and budget.</p></td>
                </tr>
                <tr>
                  <td valign="top" width="36"><div style="width:28px;height:28px;background:linear-gradient(135deg,#7B2CBF,#FF5722);border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:#fff;">3</div></td>
                  <td style="padding-left:12px;"><p style="margin:0;font-size:14px;color:#333;line-height:1.6;"><strong>Custom Package</strong> — Receive a personalised itinerary and seamlessly book your sacred journey.</p></td>
                </tr>
              </table>
            </td></tr>
          </table>
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tours" style="display:inline-block;background:linear-gradient(135deg,#FF5722 0%,#E64A19 100%);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">Browse Our Tours</a>
          </td></tr></table>
        </td>
      </tr>
      <!-- Assurance Strip -->
      <tr>
        <td style="background:#F8F9FA;border-top:1px solid #EBEBEB;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding:0 12px;border-right:1px solid #DDD;">
                <div style="font-size:22px;margin-bottom:4px;">🛡️</div>
                <div style="font-size:11px;color:#666;font-weight:600;">100% Safe Travel</div>
              </td>
              <td align="center" style="padding:0 12px;border-right:1px solid #DDD;">
                <div style="font-size:22px;margin-bottom:4px;">📞</div>
                <div style="font-size:11px;color:#666;font-weight:600;">24/7 Support</div>
              </td>
              <td align="center" style="padding:0 12px;border-right:1px solid #DDD;">
                <div style="font-size:22px;margin-bottom:4px;">✈️</div>
                <div style="font-size:11px;color:#666;font-weight:600;">Expert Guidance</div>
              </td>
              <td align="center" style="padding:0 12px;">
                <div style="font-size:22px;margin-bottom:4px;">💎</div>
                <div style="font-size:11px;color:#666;font-weight:600;">Premium Experience</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#1A2332;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px;color:#ffffff;font-size:16px;font-weight:700;">🕉️ VedicTravel</p>
          <p style="margin:0 0 12px;color:rgba(255,255,255,0.5);font-size:12px;">Connecting souls to sacred destinations</p>
          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;">© ${new Date().getFullYear()} VedicTravel. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Admin Inquiry Notification Template ────────────────────────────────────
    private getAdminInquiryNotificationTemplate(details: {
        name: string;
        email: string;
        mobile: string;
        tourName?: string;
        yatraName?: string;
        adults: number;
        children: number;
        infants: number;
        message?: string;
    }): string {
        const tripName = details.tourName || details.yatraName || 'General / Not specified';
        const totalTravelers = (details.adults || 0) + (details.children || 0) + (details.infants || 0);
        const now = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Inquiry Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#0F1923;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F1923;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#1A2332;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#FF5722 0%,#FF8C00 100%);padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle">
                <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;">VedicTravel Admin</span>
                <h1 style="color:#ffffff;margin:6px 0 0;font-size:22px;font-weight:700;">🔔 New Inquiry Received</h1>
              </td>
              <td align="right" valign="middle">
                <div style="background:rgba(255,255,255,0.2);border-radius:8px;padding:8px 16px;display:inline-block;">
                  <span style="font-size:11px;color:#fff;font-weight:600;">ACTION REQUIRED</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Timestamp -->
      <tr><td style="background:#243040;padding:12px 40px;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:12px;color:rgba(255,255,255,0.4);">Received: ${now}</span></td></tr>
      <!-- Contact Info -->
      <tr>
        <td style="padding:32px 40px 0;">
          <p style="font-size:13px;font-weight:700;color:#FF5722;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Customer Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#243040;border-radius:12px;overflow:hidden;">
            <tr>
              <td valign="top" style="padding:20px 24px;width:50%;border-right:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Name</p>
                <p style="margin:0;font-size:16px;color:#ffffff;font-weight:600;">${details.name}</p>
              </td>
              <td valign="top" style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Phone</p>
                <p style="margin:0;font-size:16px;color:#FF8C00;font-weight:600;">${details.mobile}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Email</p>
                <a href="mailto:${details.email}" style="font-size:15px;color:#FF5722;font-weight:600;text-decoration:none;">${details.email}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Trip Info -->
      <tr>
        <td style="padding:24px 40px 0;">
          <p style="font-size:13px;font-weight:700;color:#FF5722;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Trip Requirements</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#243040;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Tour / Yatra Interested In</span></td>
                    <td align="right"><span style="font-size:14px;font-weight:600;color:#ffffff;">${tripName}</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Total Travellers</span></td>
                    <td align="right"><span style="font-size:14px;font-weight:600;color:#ffffff;">${totalTravelers} person(s)</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Breakdown</span></td>
                    <td align="right"><span style="font-size:13px;color:rgba(255,255,255,0.6);">Adults: ${details.adults} &nbsp;|&nbsp; Children: ${details.children} &nbsp;|&nbsp; Infants: ${details.infants}</span></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Message -->
      ${details.message ? `
      <tr>
        <td style="padding:24px 40px 0;">
          <p style="font-size:13px;font-weight:700;color:#FF5722;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Customer Message</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#243040;border-radius:12px;border-left:3px solid #FF5722;">
            <tr><td style="padding:20px 24px;"><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;font-style:italic;">${details.message}</p></td></tr>
          </table>
        </td>
      </tr>` : ''}
      <!-- CTA -->
      <tr>
        <td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding-right:8px;" width="50%">
                <a href="mailto:${details.email}" style="display:block;background:linear-gradient(135deg,#FF5722 0%,#E64A19 100%);color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:8px;font-size:14px;font-weight:700;text-align:center;">📧 Reply to Customer</a>
              </td>
              <td align="center" style="padding-left:8px;" width="50%">
                <a href="tel:${details.mobile}" style="display:block;background:#243040;border:1px solid rgba(255,87,34,0.4);color:#FF5722;text-decoration:none;padding:14px 20px;border-radius:8px;font-size:14px;font-weight:700;text-align:center;">📞 Call Customer</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#0F1923;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;">This is an automated admin notification from VedicTravel backend. Please respond within 24 hours.</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Payment Failure Template ────────────────────────────────────────────────
    private getPaymentFailureTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
        totalAmount: number;
        transactionId?: string;
    }): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Failed</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#37474F 0%,#546E7A 100%);padding:48px 40px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:16px;">
              <div style="width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;display:inline-block;line-height:72px;font-size:36px;">⚠️</div>
            </td></tr>
            <tr><td align="center">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Payment Unsuccessful</h1>
            </td></tr>
            <tr><td align="center" style="padding-top:8px;">
              <p style="color:rgba(255,255,255,0.75);margin:0;font-size:15px;">But don't worry — your booking is saved!</p>
            </td></tr>
          </table>
        </td>
      </tr>
      <!-- Alert Banner -->
      <tr>
        <td style="background:#FFF3E0;padding:16px 40px;border-bottom:2px solid #FFB74D;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" width="24"><span style="font-size:18px;">🔔</span></td>
              <td style="padding-left:10px;"><span style="font-size:13px;color:#E65100;font-weight:600;">Action Required: Please retry your payment to secure your booking before the hold expires.</span></td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:40px;">
          <p style="font-size:17px;color:#1A2332;margin:0 0 8px;font-weight:600;">Namaste ${name},</p>
          <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 32px;">We were unable to process your payment for the booking below. This can happen due to network issues, incorrect card details, or bank restrictions. Your booking is still on hold — simply retry the payment to confirm your spiritual journey.</p>
          <!-- Booking Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;border-radius:12px;border:1px solid #EBEBEB;margin-bottom:32px;">
            <tr><td style="background:#F0F0F0;padding:14px 20px;border-bottom:1px solid #EBEBEB;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td><span style="font-size:13px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:1px;">Attempt Details</span></td>
                  <td align="right"><span style="font-size:12px;color:#999;">Ref: ${details.bookingReference}</span></td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:13px;color:#999;">Tour / Yatra</span></td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:14px;font-weight:600;color:#1A2332;">${details.tourName}</span></td>
                </tr>
                ${details.transactionId ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:13px;color:#999;">Transaction ID</span></td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #F0F0F0;"><span style="font-size:12px;font-weight:600;color:#888;font-family:monospace;">${details.transactionId}</span></td>
                </tr>` : ''}
                <tr>
                  <td style="padding:10px 0;"><span style="font-size:13px;color:#999;">Amount to Pay</span></td>
                  <td align="right" style="padding:10px 0;"><span style="font-size:20px;font-weight:700;color:#FF5722;">₹${details.totalAmount.toLocaleString('en-IN')}</span></td>
                </tr>
              </table>
            </td></tr>
          </table>
          <!-- Common Reasons -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FA;border-radius:12px;padding:0;margin-bottom:32px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#444;">Common reasons for payment failure:</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="padding:5px 0;"><span style="font-size:13px;color:#666;">• Insufficient account balance</span></td></tr>
                <tr><td style="padding:5px 0;"><span style="font-size:13px;color:#666;">• Incorrect card details or OTP timeout</span></td></tr>
                <tr><td style="padding:5px 0;"><span style="font-size:13px;color:#666;">• Bank blocked the international/online transaction</span></td></tr>
                <tr><td style="padding:5px 0;"><span style="font-size:13px;color:#666;">• Network connectivity issue during payment</span></td></tr>
              </table>
            </td></tr>
          </table>
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td align="center">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" style="display:inline-block;background:linear-gradient(135deg,#FF5722 0%,#E64A19 100%);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">🔄 Retry Payment</a>
          </td></tr></table>
          <p style="text-align:center;font-size:13px;color:#999;margin:0;">Need help? <a href="mailto:support@vedictravel.in" style="color:#FF5722;text-decoration:none;font-weight:600;">Contact our support team</a></p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#1A2332;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px;color:#ffffff;font-size:16px;font-weight:700;">🕉️ VedicTravel</p>
          <p style="margin:0 0 12px;color:rgba(255,255,255,0.5);font-size:12px;">Connecting souls to sacred destinations</p>
          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;">© ${new Date().getFullYear()} VedicTravel. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Admin New Booking Notification Template ─────────────────────────────────
    private getAdminNewBookingTemplate(details: {
        bookingReference: string;
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        tourName: string;
        travelDate: string;
        numberOfTravelers: number;
        totalAmount: number;
        paymentId?: string;
    }): string {
        const now = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Booking Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#0F1923;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F1923;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#1A2332;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#2E7D32 0%,#43A047 60%,#00BCD4 100%);padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle">
                <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;">VedicTravel Admin</span>
                <h1 style="color:#ffffff;margin:6px 0 0;font-size:22px;font-weight:700;">🎉 New Booking Confirmed!</h1>
              </td>
              <td align="right" valign="middle">
                <div style="background:rgba(255,255,255,0.2);border-radius:8px;padding:8px 16px;">
                  <span style="font-size:11px;color:#fff;font-weight:600;">PAYMENT SUCCESS</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Ref & Time -->
      <tr>
        <td style="background:#243040;padding:16px 40px;border-bottom:1px solid rgba(255,255,255,0.05);">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Booked at: ${now}</span></td>
              <td align="right"><span style="font-size:14px;font-weight:700;color:#43A047;font-family:monospace;letter-spacing:2px;">${details.bookingReference}</span></td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Revenue Highlight -->
      <tr>
        <td style="padding:32px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1B5E20 0%,#2E7D32 100%);border-radius:12px;">
            <tr><td style="padding:24px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1.5px;">Revenue Collected</p>
              <p style="margin:0;font-size:36px;font-weight:800;color:#ffffff;">₹${details.totalAmount.toLocaleString('en-IN')}</p>
              ${details.paymentId ? `<p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.4);font-family:monospace;">Payment ID: ${details.paymentId}</p>` : ''}
            </td></tr>
          </table>
        </td>
      </tr>
      <!-- Customer Info -->
      <tr>
        <td style="padding:24px 40px 0;">
          <p style="font-size:13px;font-weight:700;color:#43A047;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Customer</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#243040;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Name</span></td>
                    <td align="right"><span style="font-size:15px;font-weight:600;color:#ffffff;">${details.customerName}</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Email</span></td>
                    <td align="right"><a href="mailto:${details.customerEmail}" style="font-size:14px;color:#43A047;text-decoration:none;font-weight:600;">${details.customerEmail}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
            ${details.customerPhone ? `<tr>
              <td style="padding:16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Phone</span></td>
                    <td align="right"><a href="tel:${details.customerPhone}" style="font-size:14px;color:#43A047;text-decoration:none;font-weight:600;">${details.customerPhone}</a></td>
                  </tr>
                </table>
              </td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
      <!-- Booking Info -->
      <tr>
        <td style="padding:24px 40px 0;">
          <p style="font-size:13px;font-weight:700;color:#43A047;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Booking Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#243040;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Tour / Yatra</span></td>
                    <td align="right"><span style="font-size:14px;font-weight:600;color:#ffffff;">${details.tourName}</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Travel Date</span></td>
                    <td align="right"><span style="font-size:14px;font-weight:600;color:#ffffff;">${details.travelDate}</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><span style="font-size:12px;color:rgba(255,255,255,0.4);">Travellers</span></td>
                    <td align="right"><span style="font-size:14px;font-weight:600;color:#ffffff;">${details.numberOfTravelers} Person(s)</span></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Admin CTA -->
      <tr>
        <td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding-right:8px;" width="50%">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/bookings" style="display:block;background:linear-gradient(135deg,#2E7D32 0%,#43A047 100%);color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:8px;font-size:14px;font-weight:700;text-align:center;">📋 View in Admin</a>
              </td>
              <td align="center" style="padding-left:8px;" width="50%">
                <a href="mailto:${details.customerEmail}" style="display:block;background:#243040;border:1px solid rgba(67,160,71,0.4);color:#43A047;text-decoration:none;padding:14px 20px;border-radius:8px;font-size:14px;font-weight:700;text-align:center;">📧 Email Customer</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#0F1923;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;">Automated admin notification — VedicTravel Backend System</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Trip Reminder Template (3 Days Before) ────────────────────────────────
    private getTripReminderTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
        travelDate: string;
        numberOfTravelers: number;
    }): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Trip Starts Soon</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.12);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#FF5722 0%,#FF8A65 100%);padding:60px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:16px;">
              <div style="width:80px;height:80px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-block;line-height:80px;font-size:40px;">🌅</div>
            </td></tr>
            <tr><td align="center">
              <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;">Almost There!</h1>
            </td></tr>
            <tr><td align="center" style="padding-top:10px;">
              <p style="color:rgba(255,255,255,0.9);margin:0;font-size:18px;">Your spiritual journey starts in <strong>3 Days</strong></p>
            </td></tr>
          </table>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:40px;">
          <p style="font-size:18px;color:#1A2332;margin:0 0 12px;font-weight:600;">Namaste ${name},</p>
          <p style="font-size:16px;color:#666;line-height:1.8;margin:0 0 32px;">The wait is almost over! We're thrilled to host you on your upcoming Yatra to <strong>${details.tourName}</strong>. Our guides are ready and the sacred sites await your presence.</p>
          <!-- Details Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#FFF8F3 0%,#FFFBF9 100%);border-radius:12px;border:1px solid #FFEBE0;margin-bottom:32px;">
            <tr><td style="padding:24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="32" valign="middle"><span style="font-size:24px;">📅</span></td>
                  <td style="padding-left:14px;"><p style="margin:0;font-size:14px;color:#8E4B33;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Travel Date</p><p style="margin:2px 0 0;font-size:16px;color:#1A2332;font-weight:600;">${details.travelDate}</p></td>
                  <td align="right" style="border-left:1px solid #FFE0D0;padding-left:24px;">
                    <p style="margin:0;font-size:14px;color:#8E4B33;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Ref #</p><p style="margin:2px 0 0;font-size:16px;color:#FF5722;font-family:monospace;">${details.bookingReference}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
          <!-- Checklist -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
            <tr><td style="padding-bottom:16px;"><span style="font-size:15px;font-weight:700;color:#1A2332;text-transform:uppercase;letter-spacing:1px;">Travel Essentials Checklist</span></td></tr>
            <tr><td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td width="28" height="34" style="font-size:18px;color:#4CAF50;">✅</td><td style="font-size:15px;color:#555;">Valid ID Proof (Original)</td></tr>
                <tr><td width="28" height="34" style="font-size:18px;color:#4CAF50;">✅</td><td style="font-size:15px;color:#555;">Printed Booking Confirmation</td></tr>
                <tr><td width="28" height="34" style="font-size:18px;color:#4CAF50;">✅</td><td style="font-size:15px;color:#555;">Modest Clothing for Temple Visits</td></tr>
                <tr><td width="28" height="34" style="font-size:18px;color:#4CAF50;">✅</td><td style="font-size:15px;color:#555;">Personal Medications & Comfort Kit</td></tr>
              </table>
            </td></tr>
          </table>
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" style="display:inline-block;background:linear-gradient(135deg,#FF5722 0%,#E64A19 100%);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;box-shadow:0 4px 15px rgba(230,74,25,0.3);">View Detailed Itinerary</a>
          </td></tr></table>
        </td>
      </tr>
      <!-- Help -->
      <tr>
        <td style="background:#f8f9fa;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:14px;color:#666;">Last minute questions? Reply to this mail or call <a href="tel:+919876543210" style="color:#FF5722;font-weight:700;text-decoration:none;">+91 98765 43210</a></p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#1A2332;padding:40px;text-align:center;">
          <p style="margin:0 0 10px;color:#ffffff;font-size:18px;font-weight:700;">🕉️ VedicTravel</p>
          <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Connecting souls to sacred destinations since 2018</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Pending Payment Template (Abandoned Checkout) ────────────────────────
    private getPendingPaymentTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
        totalAmount: number;
    }): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Finish Your Booking</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.1);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#7B2CBF 0%,#9D50BB 100%);padding:50px 40px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">⏳</div>
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Still Thinking?</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:16px;">Your spot is being held, but not for long</p>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:40px;">
          <p style="font-size:17px;color:#1A2332;margin:0 0 12px;font-weight:600;">Namaste ${name},</p>
          <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 32px;">We noticed you started booking your journey to <strong>${details.tourName}</strong> but didn't quite finish. This tour is very popular and seats are filling up fast. Don't let someone else take your place!</p>
          <!-- Summary Box -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8f9fa;border-radius:12px;margin-bottom:32px;">
            <tr><td style="padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td><span style="font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Tour</span></td><td align="right"><span style="font-size:15px;color:#1A2332;font-weight:600;">${details.tourName}</span></td></tr>
                <tr><td style="padding-top:12px;"><span style="font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Total Amount</span></td><td align="right" style="padding-top:12px;"><span style="font-size:18px;color:#7B2CBF;font-weight:700;">₹${details.totalAmount.toLocaleString('en-IN')}</span></td></tr>
              </table>
            </td></tr>
          </table>
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" style="display:inline-block;background:linear-gradient(135deg,#7B2CBF 0%,#6A1B9A 100%);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:8px;font-size:16px;font-weight:700;box-shadow:0 4px 15px rgba(123,44,191,0.2);">Complete My Booking Now</a>
          </td></tr></table>
        </td>
      </tr>
      <!-- Info -->
      <tr>
        <td style="padding:0 40px 40px;text-align:center;">
          <p style="margin:0;font-size:13px;color:#999;">If you're having trouble with the payment, please reply to this email and our support team will help you out manually.</p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#1A2332;padding:30px 40px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;">VedicTravel Team</p></td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }

    // ─── Post-Trip Feedback Template ──────────────────────────────────────────
    private getFeedbackRequestTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
    }): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Share Your Feedback</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.1);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#FFD54F 0%,#FFA000 100%);padding:50px 40px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">🙏</div>
          <h1 style="color:#1A2332;margin:0;font-size:28px;font-weight:700;">Namaste & Welcome Back!</h1>
          <p style="color:rgba(26,35,50,0.7);margin:8px 0 0;font-size:16px;">How was your journey to ${details.tourName}?</p>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:40px;text-align:center;">
          <p style="font-size:17px;color:#1A2332;margin:0 0 16px;font-weight:600;">Hi ${name},</p>
          <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 32px;">We hope you had a spiritually enriching and peaceful experience on your recent Yatra. At VedicTravel, we strive to make every journey sacred and seamless, and your feedback is incredibly valuable to us.</p>
          <!-- Rating Simulation -->
          <p style="font-size:14px;color:#999;font-weight:700;text-transform:uppercase;margin-bottom:16px;">Rate your experience</p>
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:40px;">
            <tr>
              <td style="padding:0 8px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}&rating=5" style="display:inline-block;width:36px;height:36px;background:#FFD54F;border-radius:50%;line-height:36px;text-decoration:none;color:#1A2332;font-weight:700;">5</a></td>
              <td style="padding:0 8px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}&rating=4" style="display:inline-block;width:36px;height:36px;background:#EEEEEE;border-radius:50%;line-height:36px;text-decoration:none;color:#1A2332;font-weight:700;">4</a></td>
              <td style="padding:0 8px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}&rating=3" style="display:inline-block;width:36px;height:36px;background:#EEEEEE;border-radius:50%;line-height:36px;text-decoration:none;color:#1A2332;font-weight:700;">3</a></td>
              <td style="padding:0 8px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}&rating=2" style="display:inline-block;width:36px;height:36px;background:#EEEEEE;border-radius:50%;line-height:36px;text-decoration:none;color:#1A2332;font-weight:700;">2</a></td>
              <td style="padding:0 8px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}&rating=1" style="display:inline-block;width:36px;height:36px;background:#EEEEEE;border-radius:50%;line-height:36px;text-decoration:none;color:#1A2332;font-weight:700;">1</a></td>
            </tr>
          </table>
          <!-- CTA -->
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}" style="display:inline-block;background:linear-gradient(135deg,#1A2332 0%,#263238 100%);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:8px;font-size:16px;font-weight:700;box-shadow:0 4px 15px rgba(0,0,0,0.1);">Leave Full Review</a>
        </td>
      </tr>
      <!-- Thank You -->
      <tr>
        <td style="padding:0 40px 40px;text-align:center;">
          <p style="margin:0;font-size:13px;color:#999;">Thank you for being part of the VedicTravel family. Your feedback helps us connect more souls to sacred destinations.</p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#1A2332;padding:30px 40px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;">VedicTravel Support</p></td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
    }
}
