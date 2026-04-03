import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class InvoiceService {
    private readonly logger = new Logger(InvoiceService.name);

    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    /**
     * Generates a premium PDF invoice using Puppeteer
     */
    async generateInvoicePdf(booking: any): Promise<Buffer> {
        this.logger.log(`Generating PDF invoice for booking: ${booking.bookingReference}`);
        
        let browser;
        try {
            // For Cloud Run, we need specific flags to run Puppeteer
            browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--font-render-hinting=none', // Better font rendering for PDFs
                ],
                headless: 'shell' as any, // New headless mode is more stable for PDFs
                defaultViewport: {
                    width: 1200,
                    height: 1600,
                },
            });

            const page = await browser.newPage();
            const html = this.getInvoiceHtml(booking);
            await page.setContent(html, { waitUntil: 'networkidle0' });
            
            // Critical fix: Ensure all web fonts (Inter) are fully loaded before PDF generation
            await page.evaluateHandle('document.fonts.ready');
            
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true, // Respect the HTML/CSS page sizes
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px',
                },
            });

            this.logger.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

            return Buffer.from(pdfBuffer);
        } catch (error) {
            this.logger.error('Failed to generate PDF:', error);
            throw error;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    /**
     * Uploads a PDF buffer to Cloudinary and returns the secure URL
     */
    async uploadToCloudinary(pdfBuffer: Buffer, fileName: string): Promise<string> {
        this.logger.log(`Uploading invoice to Cloudinary: ${fileName}`);
        
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'invoices',
                    public_id: fileName,
                    resource_type: 'raw', // Important for PDF
                    contentType: 'application/pdf',
                },
                (error, result) => {
                    if (error) {
                        this.logger.error('Cloudinary upload failed:', error);
                        return reject(error);
                    }
                    resolve(result.secure_url);
                }
            );

            streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
        });
    }

    private getInvoiceHtml(booking: any): string {
        const date = new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const travelerName = booking.user?.name || booking.travelerDetails?.[0]?.name || 'Valued Guest';
        const tourTitle = booking.tour?.title || 'Spiritual Yatra';
        const amount = booking.totalAmount.toLocaleString('en-IN');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            color: #1A2332;
            margin: 0;
            padding: 40px;
            background: #fff;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #F5F5F5;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .logo img {
            max-width: 200px;
            height: auto;
        }
        .invoice-label {
            text-align: right;
        }
        .invoice-label h1 {
            margin: 0;
            font-size: 32px;
            color: #7B2CBF;
            letter-spacing: -1px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 60px;
        }
        .section-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #999;
            letter-spacing: 1px;
            margin-bottom: 12px;
            font-weight: 700;
        }
        .info-box p {
            margin: 4px 0;
            font-size: 15px;
            line-height: 1.5;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .table th {
            text-align: left;
            background: #F8F9FA;
            padding: 14px 20px;
            font-size: 13px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .table td {
            padding: 20px;
            border-bottom: 1px solid #F0F0F0;
            font-size: 15px;
        }
        .total-section {
            margin-left: auto;
            width: 300px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
        }
        .total-row.grand-total {
            margin-top: 10px;
            padding-top: 20px;
            border-top: 2px solid #F5F5F5;
            font-size: 20px;
            font-weight: 700;
            color: #FF5722;
        }
        .status-badge {
            display: inline-block;
            background: #E8F5E9;
            color: #2E7D32;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .footer {
            margin-top: 100px;
            text-align: center;
            color: #999;
            font-size: 13px;
            border-top: 1px solid #F5F5F5;
            padding-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="https://res.cloudinary.com/duuedlbxa/image/upload/v1775119508/branding/vt-logo-email.png" alt="VedicTravel Logo">
        </div>
        <div class="invoice-label">
            <h1>RECEIPT</h1>
            <p style="color: #666; margin: 4px 0;">#${booking.bookingReference}</p>
        </div>
    </div>

    <div class="details-grid">
        <div class="info-box">
            <div class="section-title">Billed To</div>
            <p><strong>${travelerName}</strong></p>
            <p>${booking.email || booking.user?.email || ''}</p>
            <p>${booking.phone || booking.user?.phone || ''}</p>
        </div>
        <div class="info-box" style="text-align: right;">
            <div class="section-title">Payment Details</div>
            <p>Date: ${date}</p>
            <p>Transaction ID: ${booking.payuTransactionId || 'N/A'}</p>
            <p><span class="status-badge">Paid Successfully</span></p>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Travelers</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>${tourTitle}</strong><br>
                    <span style="font-size: 13px; color: #666;">Yatra Date: ${new Date(booking.travelDate).toLocaleDateString('en-IN')}</span>
                </td>
                <td>${booking.numberOfTravelers} Person(s)</td>
                <td style="text-align: right;">₹${amount}</td>
            </tr>
        </tbody>
    </table>

    <div class="total-section">
        <div class="total-row">
            <span style="color: #666;">Subtotal</span>
            <span>₹${amount}</span>
        </div>
        <div class="total-row">
            <span style="color: #666;">Tax (0%)</span>
            <span>₹0.00</span>
        </div>
        <div class="total-row grand-total">
            <span>Total Paid</span>
            <span>₹${amount}</span>
        </div>
    </div>

    <div class="footer">
        <p>This is a computer-generated receipt. No signature is required.</p>
        <p><strong>VedicTravel</strong> &bull; Connecting souls to sacred destinations &bull; www.vedictravel.in</p>
        <p>Support: support@vedictravel.in | +91 98765 43210</p>
    </div>
</body>
</html>
        `;
    }
}
