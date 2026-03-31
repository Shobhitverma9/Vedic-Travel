import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);
    private readonly apiUrl = 'https://graph.facebook.com/v17.0';
    private readonly accessToken: string;
    private readonly phoneNumberId: string;

    constructor(private configService: ConfigService) {
        this.accessToken = this.configService.get<string>('WHATSAPP_ACCESS_TOKEN');
        this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');
    }

    /**
     * Sends a booking invoice document via WhatsApp Cloud API
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
        // Remove '+' from phone number if present
        const cleanPhone = to.replace(/\+/g, '');

        if (!this.accessToken || !this.phoneNumberId) {
            this.logger.warn(`WhatsApp credentials missing. Skipping WhatsApp for ${cleanPhone}.`);
            this.logger.log(`[MOCK WHATSAPP] To: ${cleanPhone}, Doc: ${pdfUrl}, File: ${fileName}`);
            return false;
        }

        try {
            // Meta requires a pre-approved template for outbound messages
            // This example assumes a template named 'booking_invoice' with a document header
            const payload = {
                messaging_product: 'whatsapp',
                to: cleanPhone,
                type: 'template',
                template: {
                    name: 'booking_invoice', // Must be approved in Meta Business Suite
                    language: {
                        code: 'en_US',
                    },
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
                                {
                                    type: 'text',
                                    text: details.customerName,
                                },
                                {
                                    type: 'text',
                                    text: details.bookingReference,
                                },
                            ],
                        },
                    ],
                },
            };

            const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json() as any;

            if (data.error) {
                throw new Error(data.error.message);
            }

            this.logger.log(`WhatsApp invoice sent successfully to ${cleanPhone}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send WhatsApp message to ${cleanPhone}:`, error);
            return false;
        }
    }

    /**
     * Sends a simple text notification via WhatsApp
     */
    async sendTextNotification(to: string, message: string): Promise<boolean> {
        const cleanPhone = to.replace(/\+/g, '');

        if (!this.accessToken || !this.phoneNumberId) {
            this.logger.warn(`WhatsApp credentials missing. Skipping WhatsApp text for ${cleanPhone}.`);
            this.logger.log(`[MOCK WHATSAPP TEXT] To: ${cleanPhone}, Msg: ${message}`);
            return false;
        }

        try {
            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'text',
                text: { body: message },
            };

            const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json() as any;

            if (data.error) {
                throw new Error(data.error.message);
            }

            return true;
        } catch (error) {
            this.logger.error(`Failed to send WhatsApp text to ${cleanPhone}:`, error);
            return false;
        }
    }
}
