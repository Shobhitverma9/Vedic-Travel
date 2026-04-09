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
    async generateInvoicePdf(booking: any, paidAmount?: number): Promise<Buffer> {
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
            const html = this.getInvoiceHtml(booking, paidAmount);
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

    private getInvoiceHtml(booking: any, paidAmount?: number): string {
        const date = new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Kolkata',
        });

        const travelerName = booking.user?.name || booking.travelerDetails?.[0]?.name || 'Valued Guest';
        const tourTitle = booking.tour?.title || 'Religious/Spiritual Travel Service';
        
        const totalPackageCost = booking.totalAmount || 0;
        const totalAmountForInvoice = paidAmount !== undefined ? paidAmount : totalPackageCost;
        const balanceDue = Math.max(0, totalPackageCost - totalAmountForInvoice);
        
        // Reverse calculation for 5% GST (Inclusive) for this transaction
        const basePrice = Math.round(totalAmountForInvoice / 1.05);
        const gstAmount = totalAmountForInvoice - basePrice;
        
        const packageCostStr = totalPackageCost.toLocaleString('en-IN');
        const amountStr = totalAmountForInvoice.toLocaleString('en-IN');
        const basePriceStr = basePrice.toLocaleString('en-IN');
        const gstAmountStr = gstAmount.toLocaleString('en-IN');
        const balanceDueStr = balanceDue.toLocaleString('en-IN');
        
        const placeOfSupply = booking.billingAddress?.state || 'Uttar Pradesh';
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4; margin: 0; }
        body { font-family: 'Inter', sans-serif; color: #1A2332; margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; }
        .page-container { padding: 40px; position: relative; min-height: 29.7cm; box-sizing: border-box; }
        
        /* ─── Header Section ─── */
        .tax-header { width: 100%; border-bottom: 2px solid #000; padding-bottom: 25px; margin-bottom: 20px; }
        .tax-columns { display: table; width: 100%; table-layout: fixed; }
        .tax-col { display: table-cell; vertical-align: top; }
        
        .title-h1 { margin: 0 0 15px 0; font-size: 24px; font-weight: 700; color: #000; text-transform: uppercase; }
        .logo-center { text-align: center; }
        .logo-center img { max-width: 150px; height: auto; margin-bottom: 10px; }
        
        .ids-table { width: 100%; font-size: 10px; line-height: 1.4; color: #333; }
        .ids-col { text-align: left; padding-bottom: 3px; }
        .ids-col span { font-weight: 700; color: #000; display: block; font-size: 11px; }

        .company-info { text-align: right; font-size: 10px; color: #333; line-height: 1.5; }
        .company-name { font-size: 12px; font-weight: 700; color: #000; margin-bottom: 5px; text-transform: uppercase; }
        .qr-placeholder { margin-top: 10px; text-align: right; }
        .qr-placeholder img { width: 80px; height: 80px; border: 1px solid #EEE; padding: 5px; border-radius: 4px; }

        /* ─── Metadata Summary Table ─── */
        .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #CCC; }
        .summary-table th { background: #E0E0E0; border: 1px solid #CCC; padding: 8px 12px; font-size: 11px; font-weight: 700; text-align: left; width: 25%; }
        .summary-table td { border: 1px solid #CCC; padding: 8px 12px; font-size: 11px; width: 25%; }

        /* ─── Detail Sections ─── */
        .section { margin-bottom: 20px; }
        .section-title { font-size: 13px; font-weight: 700; color: #000; margin-bottom: 8px; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 2px; }
        .detail-row { font-size: 12px; line-height: 1.6; color: #333; margin-bottom: 4px; }
        .detail-row strong { color: #000; width: 120px; display: inline-block; }

        /* ─── Points (Inclusions/Exclusions) ─── */
        .points-list { font-size: 11px; color: #444; line-height: 1.4; margin: 5px 0; }
        .points-list span { display: inline-block; margin-right: 15px; position: relative; padding-left: 10px; }
        .points-list span:before { content: '•'; position: absolute; left: 0; color: #000; font-weight: bold; }

        /* ─── Financial Table ─── */
        .finance-table { width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px solid #000; }
        .finance-table th { background: #CCC; border: 1px solid #000; padding: 10px 15px; font-size: 12px; font-weight: 700; text-align: left; }
        .finance-table td { border: 1px solid #CCC; padding: 10px 15px; font-size: 12px; }
        .finance-table tr.grand { background: #EEE; font-weight: 700; }

        /* ─── Fixed Footer ─── */
        .page-footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #EEE; padding-top: 20px; display: table; width: 100%; }
        .footer-left { display: table-cell; vertical-align: top; font-size: 9px; color: #999; }
        .footer-right { display: table-cell; vertical-align: bottom; text-align: right; font-size: 10px; font-weight: 600; }
        .page-number:after { content: 'Page 1 of 1'; }
    </style>
</head>
<body>
    <div class="page-container">
        <!-- Main Header (MakeMyTrip Style) -->
        <div class="tax-header">
            <div class="tax-columns">
                <div class="tax-col" style="width: 33%;">
                    <h1 class="title-h1">TAX INVOICE</h1>
                    <div style="font-size: 10px; color: #666; text-transform: uppercase;">Place of Supply</div>
                    <div style="font-size: 12px; font-weight: 700; color: #000;">${placeOfSupply}</div>
                </div>
                <div class="tax-col" style="width: 34%;">
                    <div class="logo-center">
                        <img src="${frontendUrl}/vt-logo-retina-black.png" alt="Vedic Travel Logo">
                    </div>
                </div>
                <div class="tax-col" style="width: 33%;">
                    <div class="company-info">
                        <div class="company-name">Travergetic Innovations PVT LTD</div>
                        <div>193/4, 2nd Floor, Sector 4, Aditya World City,<br>Bamheta, Ghaziabad, Uttar Pradesh, 201002</div>
                        <div style="margin-top: 5px;"><strong>Email:</strong> info@vedictravel.com</div>
                        <div><strong>Phone:</strong> +91 84474 70062</div>
                        <div style="margin-top: 10px; font-size: 10px;">
                            <div><strong>PAN:</strong> AAMCT0974F</div>
                            <div><strong>CIN:</strong> U79110UP2025PTC228487</div>
                            <div><strong>GSTIN:</strong> 09AAMCT0974F1Z0</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Metadata Summary Table -->
        <table class="summary-table">
            <tr>
                <th>Invoice No.</th>
                <td>VT/${booking.bookingReference}</td>
                <th>Invoice Date</th>
                <td>${date}</td>
            </tr>
            <tr>
                <th>Booking ID</th>
                <td>${booking.bookingReference}</td>
                <th>Payment Mode</th>
                <td>UPI / Online</td>
            </tr>
            <tr>
                <th>Transaction ID</th>
                <td>${booking.payuTransactionId || 'N/A'}</td>
                <th>Place of Supply</th>
                <td>${placeOfSupply}</td>
            </tr>
        </table>

        <!-- Customer Details -->
        <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="detail-row"><strong>Name:</strong> ${travelerName}</div>
            <div class="detail-row"><strong>Phone:</strong> ${booking.phone || booking.billingAddress?.mobile || 'N/A'}</div>
            <div class="detail-row"><strong>Email:</strong> ${booking.email || booking.billingAddress?.email || 'N/A'}</div>
            <div class="detail-row"><strong>Address:</strong> ${booking.billingAddress ? `${booking.billingAddress.city}, ${booking.billingAddress.state}, India` : 'N/A'}</div>
        </div>

        <!-- Package Details -->
        <div class="section">
            <div class="section-title">Package Details</div>
            <div class="detail-row"><strong>Package:</strong> ${tourTitle}</div>
            <div class="detail-row"><strong>Yatra Date:</strong> ${new Date(booking.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}</div>
            <div class="detail-row"><strong>Travellers:</strong> ${booking.numberOfTravelers} Adult(s)</div>
            <div class="detail-row"><strong>Type:</strong> Spiritual Pilgrimage / Guided Service</div>
        </div>


        <!-- Financial Breakdown -->
        <table class="finance-table">
            <thead>
                <tr>
                    <th style="width: 75%">Description</th>
                    <th style="width: 25%; text-align: right;">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Package Cost (${booking.numberOfTravelers} Pax) - Full Value</td>
                    <td style="text-align: right;">${packageCostStr}</td>
                </tr>
                <tr>
                    <td>Amount being invoiced (Transaction Basis)</td>
                    <td style="text-align: right;">${basePriceStr}</td>
                </tr>
                <tr>
                    <td>GST @ 5%</td>
                    <td style="text-align: right;">${gstAmountStr}</td>
                </tr>
                <tr class="grand">
                    <td style="border: 1px solid #000;">Total Amount</td>
                    <td style="text-align: right; border: 1px solid #000;">₹${amountStr}</td>
                </tr>
            </tbody>
        </table>

        <!-- Payment Status -->
        <div class="section" style="margin-top: 30px;">
            <div class="section-title">Payment Status</div>
            <div class="detail-row"><strong>Payment Method:</strong> ${(booking.paymentMethod || 'Online').toUpperCase()}</div>
            <div class="detail-row"><strong>Amount Paid in this Transaction:</strong> ₹${amountStr}</div>
            <div class="detail-row"><strong>Cumulative Amount Paid:</strong> ₹${(booking.paidAmount || totalAmountForInvoice).toLocaleString('en-IN')}</div>
            <div class="detail-row"><strong>Remaining Balance:</strong> ₹${Math.max(0, totalPackageCost - (booking.paidAmount || totalAmountForInvoice)).toLocaleString('en-IN')}</div>
            <div class="detail-row"><strong>Payment Date:</strong> ${date}</div>
        </div>

        <!-- Page Footer -->
        <div class="page-footer">
            <div class="footer-left">
                <strong>Registered Office:</strong> 193/4, 2nd Floor, Sector 4, Aditya World City, Bamheta, Ghaziabad, Uttar Pradesh, INDIA - 201002
                <br>Terms & Conditions apply. This is a computer-generated receipt and requires no physical signature.
            </div>
            <div class="footer-right">
                <div style="color: #666; margin-bottom: 2px;">Invoice No. VT/${booking.bookingReference}</div>
                <div class="page-number"></div>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }
}
