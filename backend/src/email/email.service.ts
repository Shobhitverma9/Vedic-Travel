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
}
