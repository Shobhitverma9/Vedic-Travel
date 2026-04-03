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
        const fromEmailAddress = this.configService.get<string>('POSTMARK_FROM_EMAIL') || 'noreply@vedictravel.com';
        this.fromEmail = `Vedic Travel <${fromEmailAddress}>`;

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

    async sendInvoiceEmail(
        email: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            totalAmount: number;
            invoiceUrl?: string;
        },
        pdfBuffer: Buffer
    ): Promise<void> {
        const subject = `Invoice for Your Sacred Journey 📄 - ${details.bookingReference}`;
        const htmlBody = this.getInvoiceEmailTemplate(name, details);
        const textBody = `Namaste ${name},\n\nPlease find attached the official receipt for your booking ${details.bookingReference} (${details.tourName}) of ₹${details.totalAmount.toLocaleString('en-IN')}.\n\nYou can also view it online here: ${details.invoiceUrl}\n\nBest regards,\nVedicTravel Team`;

        const attachments = [
            {
                Name: `Invoice-${details.bookingReference}.pdf`,
                Content: Buffer.from(pdfBuffer).toString('base64'),
                ContentType: 'application/pdf',
            },
        ];

        await this.sendEmail(email, subject, htmlBody, textBody, attachments);
    }

    private async sendEmail(
        to: string,
        subject: string,
        htmlBody: string,
        textBody: string,
        attachments?: any[]
    ): Promise<void> {
        try {
            if (!this.client) {
                // Mock mode - log to console
                this.logger.log(`[MOCK EMAIL] To: ${to}`);
                this.logger.log(`[MOCK EMAIL] Subject: ${subject}`);
                this.logger.log(`[MOCK EMAIL] Body: ${textBody}`);
                if (attachments) {
                    this.logger.log(`[MOCK EMAIL] Attachments: ${attachments.map(a => a.Name).join(', ')}`);
                }
                return;
            }

            await this.client.sendEmail({
                From: this.fromEmail,
                To: to,
                Subject: subject,
                HtmlBody: htmlBody,
                TextBody: textBody,
                MessageStream: 'outbound',
                Attachments: attachments,
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
            background: linear-gradient(135deg, #4A148C 0%, #7B2CBF 100%);
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
            background: #F3E8FF;
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
            background: linear-gradient(135deg, #4A148C 0%, #7B2CBF 100%);
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Welcome to VedicTravel!', 'Your Spiritual Journey Begins Here')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                We're thrilled to have you join the VedicTravel family! Your account has been successfully created. You're now part of a community dedicated to exploring the profound spiritual heritage of India through authentic, guided pilgrimage experiences.
            </p>
            
            <div class="why-us">
                <h3 style="color: #1A2332; margin-bottom: 15px;">Why Pilgrims Choose VedicTravel?</h3>
                <div class="feature-grid">
                    <div class="feature-item">
                        <div class="feature-icon">🛕</div>
                        <div class="feature-text"><strong>Sacred Authenticity</strong><br>Every yatra is designed by spiritual experts to ensure deep cultural and religious significance.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛡️</div>
                        <div class="feature-text"><strong>Safety & Comfort</strong><br>We prioritize your wellbeing with verified accommodations and experienced local support.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🧘</div>
                        <div class="feature-text"><strong>Expert Guidance</strong><br>Our guides don't just show the way; they share the stories and wisdom behind every stone.</div>
                    </div>
                </div>
            </div>

            <div class="trending">
                <h3 style="color: #FF5722; margin-bottom: 20px; text-align: center;">Trending Sacred Journeys</h3>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td width="48%" style="background: #FDF2F2; border-radius: 12px; padding: 15px; border: 1px solid #FFEBEB;">
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">Jagannatha Puri Yatra</div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">Experience the eternal grace of Lord Jagannath on the holy shores of Odisha.</div>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tours" style="color: #FF5722; font-size: 12px; font-weight: bold; text-decoration: none;">View Package →</a>
                        </td>
                        <td width="4%">&nbsp;</td>
                        <td width="48%" style="background: #F2FDF2; border-radius: 12px; padding: 15px; border: 1px solid #EBFFEB;">
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">Kashi Vishwanath</div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">Discover the light of liberation in the world's oldest living city, Varanasi.</div>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tours" style="color: #2E7D32; font-size: 12px; font-weight: bold; text-decoration: none;">View Package →</a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <center style="margin-top: 40px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">Start Exploring Now</a>
            </center>
            
            <p class="message" style="margin-top: 30px; text-align: center; font-style: italic;">
                "Travel is more than the seeing of sights; it is a change that goes on, deep and permanent, in the ideas of living."
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
</body>
</html>`;
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Booking Confirmed!', 'Your Sacred Journey is Officially Booked')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                We are delighted to confirm your upcoming spiritual journey with VedicTravel. Your spot has been secured, and our team is already preparing to make this a truly transformative experience for you.
            </p>

            <table class="details-table">
                <tr><td class="label">Booking Ref</td><td class="value">${details.bookingReference}</td></tr>
                <tr><td class="label">Tour / Yatra</td><td class="value">${details.tourName}</td></tr>
                <tr><td class="label">Travel Date</td><td class="value">${details.travelDate}</td></tr>
                <tr><td class="label">Travellers</td><td class="value">${details.numberOfTravelers} Person(s)</td></tr>
                <tr><td class="label">Total Paid</td><td class="value" style="color: #2E7D32;">₹${details.totalAmount.toLocaleString('en-IN')}</td></tr>
            </table>

            <div style="background: #F8FAFC; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #EDF2F7;">
                <h4 style="margin-top:0; color: #1A2332;">🙏 Spiritual Preparation</h4>
                <ul style="padding-left: 20px; font-size: 14px; color: #4A5568; line-height: 1.6;">
                    <li><strong>Dress Code:</strong> For temple visits, please carry modest traditional attire.</li>
                    <li><strong>Documents:</strong> Please carry a valid Govt. ID proof in original.</li>
                    <li><strong>Essentials:</strong> Consider carrying light woolens for evening aartis or higher altitudes.</li>
                    <li><strong>Receipt:</strong> We have attached your official payment receipt/invoice to this email.</li>
                </ul>
            </div>

            <div class="message" style="background: #FFF8F3; padding: 20px; border-radius: 12px; border-left: 4px solid #FF5722; font-size: 14px;">
                <strong>What's Next?</strong><br>
                Our lead travel expert will contact you via WhatsApp/Phone within 24 hours to share the final detailed itinerary and introduce your spiritual guide.
            </div>

            <center style="margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="cta-button">View Full Booking Details</a>
            </center>

            <p style="text-align: center; color: #718096; font-size: 13px;">
                Have questions? Reply to this email or call our 24/7 dedicated helpline at <strong>+91 98765 43210</strong>.
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
</body>
</html>`;
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
        <td style="background:linear-gradient(135deg,#7F0000 0%,#B71C1C 60%,#E53935 100%);padding:48px 40px 40px;text-align:center;">
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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Inquiry Received', 'Your Pilgrimage Planning Starts Here')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                Thank you for reaching out to VedicTravel! We've received your inquiry and our spiritual journey experts are already reviewing your requirements. We understand that a pilgrimage is a deeply personal journey, and we're committed to making it perfect for you.
            </p>

            <table class="details-table">
                <tr><td class="label">Interested In</td><td class="value">${tripName}</td></tr>
                <tr><td class="label">Travellers</td><td class="value">${totalTravelers} (A: ${details.adults}, C: ${details.children}, I: ${details.infants})</td></tr>
                ${details.message ? `<tr><td class="label">Your Note</td><td class="value">"${details.message}"</td></tr>` : ''}
            </table>

            <div style="margin: 30px 0;">
                <h4 style="color: #1A2332; margin-bottom: 20px;">What to Expect Next?</h4>
                <div class="feature-item" style="background: #F0FDF4; border-color: #DCFCE7;">
                    <div class="feature-icon">📞</div>
                    <div class="feature-text"><strong>Review & Call:</strong> A travel specialist will review your request and call you within 24 hours to discuss your preferences and budget.</div>
                </div>
                <div class="feature-item" style="background: #EFF6FF; border-color: #DBEAFE;">
                    <div class="feature-icon">📜</div>
                    <div class="feature-text"><strong>Custom Itinerary:</strong> We'll design a personalized itinerary that aligns with your spiritual goals and comfort requirements.</div>
                </div>
            </div>

            <center style="margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blogs" class="cta-button">Read Our Spiritual Blog</a>
            </center>

            <p class="message" style="font-size: 14px; text-align: center;">
                While you wait, feel free to explore our collection of sacred stories and travel tips on our blog.
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Payment Unsuccessful', 'Don\'t Worry, Your Spot is Still on Hold')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                We encountered an issue while processing your payment for the <strong>${details.tourName}</strong>. This can happen for several reasons (bank limits, network timeout, etc.), but your booking isn't lost yet!
            </p>

            <table class="details-table">
                <tr><td class="label">Tour / Yatra</td><td class="value">${details.tourName}</td></tr>
                <tr><td class="label">Amount Due</td><td class="value" style="color: #E53E3E;">₹${details.totalAmount.toLocaleString('en-IN')}</td></tr>
                ${details.transactionId ? `<tr><td class="label">Attempt ID</td><td class="value">${details.transactionId}</td></tr>` : ''}
            </table>

            <div style="background: #FFF5F5; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #FED7D7;">
                <h4 style="margin-top:0; color: #C53030;">💡 Quick Troubleshooting</h4>
                <ul style="padding-left: 20px; font-size: 14px; color: #9B2C2C; line-height: 1.6; margin-bottom: 0;">
                    <li>Ensure your card is enabled for online/international transactions.</li>
                    <li>Check if the OTP was correctly entered before it expired.</li>
                    <li>Try an alternative payment method (UPI, different card, etc.).</li>
                </ul>
            </div>

            <center style="margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="cta-button" style="background: #E53E3E; box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);">Retry Payment Now</a>
            </center>

            <p class="message" style="font-size: 14px; text-align: center; color: #718096;">
                Your spot is temporarily held. Please retry to avoid cancellation.
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Your Journey Begins Soon!', 'Get Ready for Your Sacred Experience')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                The wait is almost over! Your spiritual journey to <strong>${details.tourName}</strong> is just 3 days away. We're honored to host you and are putting the final touches on your pilgrimage.
            </p>

            <table class="details-table">
                <tr><td class="label">Booking Ref</td><td class="value">${details.bookingReference}</td></tr>
                <tr><td class="label">Travel Date</td><td class="value">${details.travelDate}</td></tr>
                <tr><td class="label">Travellers</td><td class="value">${details.numberOfTravelers} Person(s)</td></tr>
            </table>

            <div style="background: #FFFBEB; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #FEF3C7;">
                <h4 style="margin-top:0; color: #92400E;">🧭 Final Checklist</h4>
                <ul style="padding-left: 20px; font-size: 14px; color: #78350F; line-height: 1.6; margin-bottom: 0;">
                    <li><strong>ID Proof:</strong> Ensure you have your original Photo ID (Aadhar/Voter ID/Passport).</li>
                    <li><strong>E-Ticket:</strong> Keep a digital or printed copy of your booking confirmation.</li>
                    <li><strong>Luggage:</strong> Pack light but don't forget essentials like sanitizers and personal meds.</li>
                    <li><strong>Weather:</strong> Check the local weather of <strong>${details.tourName}</strong> before packing.</li>
                </ul>
            </div>

            <center style="margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="cta-button">View Full Itinerary</a>
            </center>

            <p class="message" style="font-size: 14px; text-align: center; border-top: 1px solid #EDF2F7; padding-top: 20px;">
                Our ground team will be in touch shortly with the final coordinates for your pick-up.
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #7B2CBF 0%, #9D50BB 100%);">
            <div style="font-size: 48px; margin-bottom: 15px;">⏳</div>
            <h1>Don't Miss Your Spot!</h1>
            <p>Your pilgrimage to ${details.tourName} is waiting</p>
        </div>
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                We noticed you were planning a sacred journey to <strong>${details.tourName}</strong> but didn't quite finish. We understand that a pilgrimage is a big decision, but we wanted to remind you that spots on this particular yatra are filling up exceptionally fast.
            </p>

            <table class="details-table">
                <tr><td class="label">Tour / Yatra</td><td class="value">${details.tourName}</td></tr>
                <tr><td class="label">Total Amount</td><td class="value" style="color: #7B2CBF;">₹${details.totalAmount.toLocaleString('en-IN')}</td></tr>
            </table>

            <div style="background: #F8F4FF; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #E9D5FF;">
                <h4 style="margin-top:0; color: #7B2CBF;">🔥 Why finish your booking now?</h4>
                <ul style="padding-left: 20px; font-size: 14px; color: #5B21B6; line-height: 1.6; margin-bottom: 0;">
                    <li><strong>Guaranteed Price:</strong> Locking in your booking now protects you from any seasonal price increases.</li>
                    <li><strong>Best Accommodations:</strong> Early bookings get priority for rooms with the best views of sacred sites.</li>
                    <li><strong>Peace of Mind:</strong> Check one major item off your spiritual "to-do" list today.</li>
                </ul>
            </div>

            <center style="margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="cta-button" style="background: linear-gradient(135deg, #7B2CBF 0%, #6D28D9 100%); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">Complete My Booking Now</a>
            </center>

            <div style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 12px;">
                <p style="margin: 0; font-size: 14px; color: #4A5568;">
                    <strong>Need Help?</strong> Having trouble with payment or have more questions? 
                    <br>Just reply to this email or WhatsApp us at <strong>+91 98765 43210</strong>.
                </p>
            </div>
        </div>
        ${this.getEmailFooter()}
    </div>
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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Namaste & Welcome Back!', 'How Was Your Spiritual Journey?')}
        <div class="content">
            <div class="greeting">Hi ${name},</div>
            <p class="message">
                We hope your recent Yatra to <strong>${details.tourName}</strong> was spiritually enriching and peaceful. At VedicTravel, we strive to make every pilgrimage sacred and seamless, and your feedback is incredibly valuable to help us serve future pilgrims better.
            </p>

            <div style="background: #F8FAFC; border-radius: 12px; padding: 30px; text-align: center; border: 1px solid #EDF2F7; margin: 30px 0;">
                <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #718096; font-weight: 700; margin-bottom: 20px;">Rate Your Experience</p>
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        ${[1, 2, 3, 4, 5].map(star => `
                            <td style="padding: 0 5px;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}&rating=${star}" style="display: block; width: 38px; height: 38px; line-height: 38px; background: #FF5722; color: #ffffff; border-radius: 50%; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 10px rgba(255, 87, 34, 0.2);">${star}</a>
                            </td>
                        `).join('')}
                    </tr>
                </table>
                <p style="margin-top: 20px; font-size: 12px; color: #A0AEC0;">(1: Poor, 5: Exceptional)</p>
            </div>

            <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews/new?ref=${details.bookingReference}" class="cta-button">Write a Detailed Review</a>
            </center>

            <p class="message" style="margin-top: 35px; text-align: center; border-top: 1px solid #EDF2F7; padding-top: 25px; font-style: italic;">
                "Sharing your journey helps others light their own path."
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
</body>
</html>`;
    }

    private getInvoiceEmailTemplate(name: string, details: {
        bookingReference: string;
        tourName: string;
        totalAmount: number;
        invoiceUrl?: string;
    }): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${this.getEmailHeader('Invoice Ready', 'Official Receipt for Your Sacred Journey')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                Thank you for your trust in VedicTravel. We have successfully processed your payment for your upcoming pilgrimage. Please find your booking summary and invoice details below.
            </p>
            
            <table class="details-table">
                <tr><td class="label">Booking Ref</td><td class="value">${details.bookingReference}</td></tr>
                <tr><td class="label">Tour / Yatra</td><td class="value">${details.tourName}</td></tr>
                <tr><td class="label">Total Amount</td><td class="value" style="color: #2D3748;">₹${details.totalAmount.toLocaleString('en-IN')}</td></tr>
            </table>
            
            <div style="background: #F0FDF4; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #DCFCE7; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #166534;">
                    <strong>Payment Confirmed!</strong> Your official PDF receipt is attached to this email for your records.
                </p>
            </div>
            
            ${details.invoiceUrl ? `
            <center>
                <a href="${details.invoiceUrl}" class="cta-button" style="background: #1A2332;">Download Invoice Copy</a>
            </center>` : ''}
            
            <p class="message" style="margin-top: 30px; font-size: 14px; text-align: center; color: #718096;">
                Need a GST invoice or have specific billing requests? 
                <br>Contact our accounts team at <strong>accounts@vedictravel.com</strong>.
            </p>
        </div>
        ${this.getEmailFooter()}
    </div>
</body>
</html>`;
    }

    private getEmailStyles(): string {
        return `
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #FFF8F3; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
            .header { background: linear-gradient(135deg, #4A148C 0%, #7B2CBF 100%); padding: 50px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 15px 0 10px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; }
            .logo-img { max-width: 150px; height: auto; margin-bottom: 5px; }
            .header p { color: rgba(255, 255, 255, 0.85); margin: 0; font-size: 16px; font-weight: 500; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 20px; color: #1A2332; margin-bottom: 12px; font-weight: 800; border-bottom: 2px solid #FF5722; display: inline-block; padding-bottom: 4px; }
            .message { color: #4A5568; font-size: 16px; line-height: 1.8; margin-bottom: 24px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%); color: #ffffff !important; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3); transition: all 0.3s ease; }
            .feature-grid { margin: 30px 0; }
            .feature-item { margin-bottom: 20px; padding: 15px; background: #fff8f3; border-radius: 12px; border: 1px solid #ffe8e0; display: table; width: 100%; box-sizing: border-box; }
            .feature-icon { font-size: 24px; display: table-cell; width: 40px; vertical-align: top; padding-right: 15px; }
            .feature-text { font-size: 14px; color: #4A5568; line-height: 1.6; display: table-cell; vertical-align: top; }
            .details-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 25px 0; border: 1px solid #EDF2F7; border-radius: 12px; overflow: hidden; }
            .details-table td { padding: 16px; border-bottom: 1px solid #EDF2F7; font-size: 14px; color: #4A5568; }
            .details-table tr:last-child td { border-bottom: none; }
            .details-table td.label { width: 40%; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; background: #F8FAFC; }
            .details-table td.value { color: #1A202C; font-weight: 700; }
            .footer { background-color: #1A2332; color: #ffffff; padding: 40px 30px; text-align: center; }
            .footer-links a { color: #A0AEC0; text-decoration: none; margin: 0 10px; font-size: 13px; font-weight: 600; }
            .footer-social { margin-top: 25px; }
            .footer-social a { display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; line-height: 32px; font-size: 14px; text-decoration: none; color: white; }
            .footer-address { margin-top: 25px; font-size: 12px; color: #718096; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; }
        `;
    }

    private getEmailHeader(title: string, subtitle?: string): string {
        const logoUrl = 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775119508/branding/vt-logo-email.png';
        return `
            <div class="header">
                <img src="${logoUrl}" alt="VedicTravel Logo" class="logo-img">
                <h1>${title}</h1>
                ${subtitle ? `<p>${subtitle}</p>` : ''}
            </div>
        `;
    }

    private getEmailFooter(): string {
        return `
            <div class="footer">
                <div style="font-size: 20px; font-weight: 800; color: #FF5722; margin-bottom: 10px;">VedicTravel</div>
                <div style="font-size: 13px; color: #A0AEC0; margin-bottom: 25px;">Connecting souls to sacred destinations</div>
                
                <div class="footer-links">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tours">Explore Tours</a>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blogs">Spiritual Blog</a>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/about">Our Mission</a>
                </div>
                
                <div class="footer-social">
                    <a href="#" title="Facebook">f</a>
                    <a href="#" title="Instagram">ig</a>
                    <a href="#" title="YouTube">yt</a>
                    <a href="#" title="WhatsApp">wa</a>
                </div>
                
                <div class="footer-address">
                    <p><strong>VedicTravel PVT LTD</strong><br>
                    Haridwar, Uttarakhand - 249401, India</p>
                    <p style="margin-top: 10px; font-size: 10px; color: #4A5568;">
                        You are receiving this email because you registered on vedictravel.in.<br>
                        © ${new Date().getFullYear()} VedicTravel. All rights reserved.
                    </p>
                </div>
            </div>
        `;
    }
}
