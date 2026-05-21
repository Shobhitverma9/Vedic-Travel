import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);
    private readonly timespanelApiKey: string;
    private readonly timespanelBaseUrl: string;
    private readonly timespanelSenderNumber: string;
    private readonly adminWhatsappNumber: string;

    constructor(private configService: ConfigService) {
        this.timespanelApiKey = this.configService.get<string>('TIMESPANEL_API_KEY')?.trim();
        this.timespanelBaseUrl = this.configService.get<string>('TIMESPANEL_BASE_URL')?.trim() || 'https://api.timespanel.in/wa/v2/messages/send';
        this.timespanelSenderNumber = this.configService.get<string>('TIMESPANEL_SENDER_NUMBER')?.trim() || '918587800062';
        this.adminWhatsappNumber = this.configService.get<string>('ADMIN_WHATSAPP_NUMBER')?.trim() || '918587800062';

        if (!this.timespanelApiKey) {
            this.logger.warn('⚠️ TIMESPANEL_API_KEY not found in configuration. WhatsApp notifications will be mocked.');
        } else {
            this.logger.log(`✅ Timespanel initialized. Sender: ${this.timespanelSenderNumber}, Admin: ${this.adminWhatsappNumber}`);
        }
    }

    /**
     * Helper to normalize Indian phone numbers to 12 digits (with country code 91)
     */
    private normalizePhone(phone: string): string {
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) {
            cleanPhone = `91${cleanPhone}`;
        }
        return cleanPhone;
    }

    /**
     * Generic helper to send any approved WhatsApp template (body-only, text params)
     */
    private async sendTemplate(
        to: string,
        templateName: string,
        parameters: string[],
    ): Promise<boolean> {
        const cleanPhone = this.normalizePhone(to);

        if (!this.timespanelApiKey) {
            this.logger.warn(`WhatsApp credentials missing. Mocking template '${templateName}' to ${cleanPhone}.`);
            return false;
        }

        try {
            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                from: this.timespanelSenderNumber,
                to: cleanPhone,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'en' },
                    components: [
                        {
                            type: 'body',
                            parameters: parameters.map(text => ({ type: 'text', text })),
                        },
                    ],
                },
            };

            const response = await fetch(this.timespanelBaseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.timespanelApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json() as any;

            // v2 API returns {status: true, code: 200} on success
            const isSuccess = data.status === true || data.code === 200 || data.status === 'success' || data.status === 's' || data.success === true;
            if (!isSuccess) {
                throw new Error(data.error?.message || data.message || JSON.stringify(data));
            }

            this.logger.log(`✅ WhatsApp template '${templateName}' sent to ${cleanPhone}`);
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to send WhatsApp template '${templateName}' to ${cleanPhone}:`, error);
            return false;
        }
    }

    /**
     * Sends a booking invoice document via Timespanel WhatsApp API using 'receipt' template
     */
    async sendBookingInvoiceDoc(
        to: string,
        pdfUrl: string,
        fileName: string,
        details: {
            customerName: string;
            bookingReference: string;
        }
    ): Promise<boolean> {
        const cleanPhone = this.normalizePhone(to);

        if (!this.timespanelApiKey) {
            this.logger.warn(`WhatsApp credentials missing. Skipping WhatsApp for ${cleanPhone}.`);
            return false;
        }

        try {
            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                from: this.timespanelSenderNumber,
                to: cleanPhone,
                type: 'template',
                template: {
                    name: 'receipt',
                    language: { code: 'en' },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                {
                                    type: 'document',
                                    document: {
                                        link: pdfUrl,
                                        filename: fileName,
                                    },
                                },
                            ],
                        },
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: details.customerName },
                                { type: 'text', text: details.bookingReference },
                            ],
                        },
                    ],
                },
            };

            const response = await fetch(this.timespanelBaseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.timespanelApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json() as any;

            // v2 API returns {status: true, code: 200} on success
            const isSuccess = data.status === true || data.code === 200 || data.status === 'success' || data.status === 's' || data.success === true;
            if (!isSuccess) {
                throw new Error(data.error?.message || data.message || JSON.stringify(data));
            }

            this.logger.log(`✅ WhatsApp invoice response for ${cleanPhone}: ${JSON.stringify(data)}`);
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to send WhatsApp invoice template to ${cleanPhone}:`, error);
            return false;
        }
    }

    /**
     * Sends a simple text notification (for admin alerts and free-form messages)
     */
    async sendTextNotification(to: string, message: string): Promise<boolean> {
        const cleanPhone = this.normalizePhone(to);

        if (!this.timespanelApiKey) {
            this.logger.warn(`WhatsApp credentials missing. Skipping WhatsApp text for ${cleanPhone}.`);
            return false;
        }

        try {
            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                from: this.timespanelSenderNumber,
                to: cleanPhone,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message,
                },
            };

            const response = await fetch(this.timespanelBaseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.timespanelApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json() as any;

            // v2 API returns {status: true, code: 200} on success
            const isSuccess = data.status === true || data.code === 200 || data.status === 'success' || data.status === 's' || data.success === true;
            if (!isSuccess) {
                throw new Error(data.error?.message || data.message || JSON.stringify(data));
            }

            this.logger.log(`✅ WhatsApp text notification sent successfully to ${cleanPhone}`);
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to send WhatsApp text to ${cleanPhone}:`, error);
            return false;
        }
    }

    /**
     * OTP verification via 'otp_verification' template
     * {{1}} = OTP code, {{2}} = purpose
     */
    async sendOTP(phone: string, otpCode: string, name: string, purpose: string): Promise<boolean> {
        const action = purpose === 'registration' ? 'registration' : 'login';
        return this.sendTemplate(phone, 'otp_verification', [otpCode, action]);
    }

    /**
     * Welcome message via 'welcome' template
     * {{1}} = customer name
     */
    async sendWelcome(phone: string, name: string): Promise<boolean> {
        return this.sendTemplate(phone, 'welcome', [name]);
    }

    /**
     * Booking confirmation via 'booking_confirmation' template
     * {{1}} name, {{2}} tour, {{3}} ref, {{4}} date, {{5}} travellers, {{6}} total, {{7}} paid
     */
    async sendBookingConfirmation(
        phone: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            travelDate: string;
            numberOfTravelers: number;
            totalAmount: number;
            paidAmount: number;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'booking_confirmation', [
            name,
            details.tourName,
            details.bookingReference,
            details.travelDate,
            String(details.numberOfTravelers),
            details.totalAmount.toLocaleString('en-IN'),
            details.paidAmount.toLocaleString('en-IN'),
        ]);
    }

    /**
     * Booking cancellation via 'booking_cancellation' template
     * {{1}} name, {{2}} tour, {{3}} ref, {{4}} date
     */
    async sendBookingCancellation(
        phone: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            travelDate: string;
            numberOfTravelers: number;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'booking_cancellation', [
            name,
            details.tourName,
            details.bookingReference,
            details.travelDate,
        ]);
    }

    /**
     * Inquiry acknowledgement via 'inquiry_acknowledgement' template
     * {{1}} name, {{2}} tour name
     */
    async sendInquiryAcknowledgement(
        phone: string,
        name: string,
        details: {
            tourName: string;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'inquiry_acknowledgement', [name, details.tourName]);
    }

    /**
     * Payment failure via 'payment_failure' template
     * {{1}} name, {{2}} tour, {{3}} ref, {{4}} amount
     */
    async sendPaymentFailure(
        phone: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            totalAmount: number;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'payment_failure', [
            name,
            details.tourName,
            details.bookingReference,
            details.totalAmount.toLocaleString('en-IN'),
        ]);
    }

    /**
     * Trip reminder (3 days before) via 'trip_reminder' template
     * {{1}} name, {{2}} tour, {{3}} date, {{4}} ref
     */
    async sendTripReminder(
        phone: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            travelDate: string;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'trip_reminder', [
            name,
            details.tourName,
            details.travelDate,
            details.bookingReference,
        ]);
    }

    /**
     * Pending payment reminder via 'pending_payment_reminder' template
     * {{1}} name, {{2}} amount, {{3}} tour, {{4}} ref
     */
    async sendPendingPaymentReminder(
        phone: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
            totalAmount: number;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'pending_payment_reminder', [
            name,
            details.totalAmount.toLocaleString('en-IN'),
            details.tourName,
            details.bookingReference,
        ]);
    }

    /**
     * Post-trip feedback request via 'feedback_request' template
     * {{1}} name, {{2}} tour
     */
    async sendFeedbackRequest(
        phone: string,
        name: string,
        details: {
            bookingReference: string;
            tourName: string;
        }
    ): Promise<boolean> {
        return this.sendTemplate(phone, 'feedback_request', [name, details.tourName]);
    }

    /**
     * Admin alert via plain text (no template needed — internal number)
     */
    async sendAdminAlert(message: string): Promise<boolean> {
        if (!this.adminWhatsappNumber) {
            return false;
        }
        return this.sendTextNotification(this.adminWhatsappNumber, message);
    }
}
