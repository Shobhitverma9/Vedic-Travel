require('dotenv').config();
const postmark = require('postmark');
const puppeteer = require('puppeteer');

// Data from the last booking found in DB
const booking = {
  "_id": "69cf8b50869ef99b15172913",
  "numberOfTravelers": 1,
  "travelDate": "2026-04-02T18:30:00.000Z",
  "totalAmount": 30000,
  "travelerDetails": [{ "name": "Mr Shobhit Verma" }],
  "email": "shooffverm@gmail.com",
  "bookingReference": "VTMNIPS3GTLCG6",
  "payuTransactionId": "TXN17752092965533Y4K6JU",
  "tour": { "title": "Jagannatha Puri Yatra" } // Mocking joined tour data
};

const apiKey = process.env.POSTMARK_API_KEY;
const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'noreply@vedictravel.com';

if (!apiKey) {
    console.error('POSTMARK_API_KEY is missing');
    process.exit(1);
}

const client = new postmark.ServerClient(apiKey);

// --- INVOICE HTML GENERATION (Matching updated invoice.service.ts) ---
function getInvoiceHtml(booking) {
    const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const travelerName = booking.travelerDetails?.[0]?.name || 'Valued Guest';
    const tourTitle = booking.tour?.title || 'Religious/Spiritual Travel Service';
    const totalAmount = booking.totalAmount || 0;
    
    // Reverse calculation for 5% GST (Inclusive)
    const basePrice = Math.round(totalAmount / 1.05);
    const gstAmount = totalAmount - basePrice;
    
    const amountStr = totalAmount.toLocaleString('en-IN');
    const basePriceStr = basePrice.toLocaleString('en-IN');
    const gstAmountStr = gstAmount.toLocaleString('en-IN');
    
    const frontendUrl = 'http://localhost:3000';

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

        /* ─── Metadata Summary Table ─── */
        .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #CCC; }
        .summary-table th { background: #E0E0E0; border: 1px solid #CCC; padding: 8px 12px; font-size: 11px; font-weight: 700; text-align: left; width: 25%; }
        .summary-table td { border: 1px solid #CCC; padding: 8px 12px; font-size: 11px; width: 25%; }

        /* ─── Detail Sections ─── */
        .section { margin-bottom: 20px; }
        .section-title { font-size: 13px; font-weight: 700; color: #000; margin-bottom: 8px; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 2px; }
        .detail-row { font-size: 12px; line-height: 1.6; color: #333; margin-bottom: 4px; }
        .detail-row strong { color: #000; width: 120px; display: inline-block; }

        /* ─── Points (Inclusions) ─── */
        .points-list { font-size: 11px; color: #444; line-height: 1.4; margin: 5px 0; }
        .points-list span { display: inline-block; margin-right: 15px; position: relative; padding-left: 10px; }
        .points-list span:before { content: '•'; position: absolute; left: 0; color: #000; font-weight: bold; }

        /* ─── Financial Table ─── */
        .finance-table { width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px solid #000; }
        .finance-table th { background: #CCC; border: 1px solid #000; padding: 10px 15px; font-size: 12px; font-weight: 700; text-align: left; }
        .finance-table td { border: 1px solid #CCC; padding: 10px 15px; font-size: 12px; }
        .finance-table tr.grand { background: #EEE; font-weight: 700; }
        .finance-table tr.grand td { border: 1px solid #000; }

        /* ─── Fixed Footer ─── */
        .page-footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #EEE; padding-top: 20px; display: table; width: 100%; }
        .footer-left { display: table-cell; vertical-align: top; font-size: 9px; color: #999; }
        .footer-right { display: table-cell; vertical-align: bottom; text-align: right; font-size: 10px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="page-container">
        <!-- Main Header -->
        <div class="tax-header">
            <div class="tax-columns">
                <div class="tax-col" style="width: 33%;">
                    <h1 class="title-h1">TAX INVOICE</h1>
                    <div style="font-size: 10px; color: #666; text-transform: uppercase;">Place of Supply</div>
                    <div style="font-size: 12px; font-weight: 700; color: #000;">Uttar Pradesh</div>
                </div>
                <div class="tax-col" style="width: 34%;">
                    <div class="logo-center">
                        <img src="http://localhost:3000/vt-logo-retina-black.png" alt="VedicTravel Logo">
                        <table class="ids-table">
                            <tr><td class="ids-col">PAN: <span>AAMCT0974F</span></td></tr>
                            <tr><td class="ids-col">CIN: <span>U79110UP2025PTC228487</span></td></tr>
                            <tr><td class="ids-col">GSTIN: <span>09AAMCT0974F1Z0</span></td></tr>
                        </table>
                    </div>
                </div>
                <div class="tax-col" style="width: 33%;">
                    <div class="company-info">
                        <div class="company-name">Travergetic Innovations PVT LTD</div>
                        <div>193/4, 2nd Floor, Sector 4, Aditya World City,<br>Bamheta, Ghaziabad, Uttar Pradesh, 201002</div>
                        <div style="margin-top: 5px;"><strong>Email:</strong> info@vedictravel.com</div>
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
                <td>Uttar Pradesh</td>
            </tr>
        </table>

        <!-- Customer Details -->
        <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="detail-row"><strong>Name:</strong> ${travelerName}</div>
            <div class="detail-row"><strong>Phone:</strong> +91-XXXXXXXXXX</div>
            <div class="detail-row"><strong>Email:</strong> ${booking.email}</div>
            <div class="detail-row"><strong>Address:</strong> Ghaziabad, Uttar Pradesh, India</div>
        </div>

        <!-- Package Details -->
        <div class="section">
            <div class="section-title">Package Details</div>
            <div class="detail-row"><strong>Package:</strong> ${tourTitle}</div>
            <div class="detail-row"><strong>Yatra Date:</strong> 20 May 2026 to 24 May 2026</div>
            <div class="detail-row"><strong>Travellers:</strong> ${booking.numberOfTravelers} Adult(s)</div>
            <div class="detail-row"><strong>Type:</strong> Spiritual Pilgrimage / Guided Service</div>
        </div>

        <!-- Inclusions & Exclusions -->
        <div class="section" style="margin-top: 25px;">
            <div class="section-title">Inclusions</div>
            <div class="points-list">
                <span>Coordination of Sacred Rituals</span>
                <span>Spiritual Guidance</span>
                <span>Hotel/Dharamshala Coordination</span>
                <span>Local Transfers</span>
                <span>Assistance at Holy Shrines</span>
            </div>
            
            <div class="section-title" style="margin-top: 15px;">Exclusions</div>
            <div class="points-list">
                <span>Personal Offerings (Dakshina)</span>
                <span>Private Poojas</span>
                <span>Travel Insurance</span>
                <span>Personal Medical Expenses</span>
                <span>Extra Meals</span>
            </div>
        </div>

        <!-- Financial Breakdown -->
        <table class="finance-table">
            <thead>
                <tr>
                    <th style="width: 70%">Description</th>
                    <th style="width: 30%; text-align: right;">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Package Cost (${booking.numberOfTravelers} Pax)</td>
                    <td style="text-align: right;">${basePriceStr}</td>
                </tr>
                <tr>
                    <td>GST @ 5%</td>
                    <td style="text-align: right;">${gstAmountStr}</td>
                </tr>
                <tr class="grand">
                    <td>Total Amount</td>
                    <td style="text-align: right;">₹${amountStr}</td>
                </tr>
            </tbody>
        </table>

        <!-- Payment Status -->
        <div class="section" style="margin-top: 30px;">
            <div class="section-title">Payment Status</div>
            <div class="detail-row"><strong>Amount Paid:</strong> ₹${amountStr}</div>
            <div class="detail-row"><strong>Balance:</strong> ₹0</div>
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
                <div class="page-number">Page 1 of 1</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// --- EMAIL HTML GENERATION (Matching updated email.service.ts) ---
function getEmailBody(name, ref, tour, amount) {
    const styles = `
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #FFF8F3; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #4A148C 0%, #7B2CBF 100%); padding: 50px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 15px 0 10px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; }
        .logo-img { max-width: 150px; height: auto; margin-bottom: 5px; }
        .header p { color: rgba(255, 255, 255, 0.85); margin: 0; font-size: 16px; font-weight: 500; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #1A2332; margin-bottom: 24px; font-weight: 800; border-bottom: 2px solid #FF5722; display: inline-block; padding-bottom: 4px; }
        .footer { background-color: #1A2332; color: #ffffff; padding: 40px 30px; text-align: center; }
    `;

    return `
<!DOCTYPE html>
<html>
<head><style>${styles}</style></head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/duuedlbxa/image/upload/v1775119508/branding/vt-logo-email.png" alt="VedicTravel Logo" class="logo-img">
            <h1>Payment Receipt</h1>
            <p>Your Sacred Journey Details</p>
        </div>
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p>Please find attached the official receipt for your booking <strong>${ref}</strong> (${tour}) of <strong>₹${amount.toLocaleString('en-IN')}</strong>.</p>
            <p>We look forward to being a part of your spiritual journey.</p>
        </div>
        <div class="footer">
            <div style="font-size: 20px; font-weight: 800; color: #FF5722; margin-bottom: 10px;">VedicTravel</div>
            <div style="font-size: 12px; color: #A0AEC0;">© 2026 VedicTravel. All rights reserved.</div>
        </div>
    </div>
</body>
</html>`;
}

async function runTest() {
    console.log('Generating PDF Invoice...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(getInvoiceHtml(booking), { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    console.log('PDF Generated successfully.');

    console.log('Sending Email with Attachment...');
    try {
        const result = await client.sendEmail({
            From: `Vedic Travel <${fromEmail}>`,
            To: booking.email,
            Subject: `Invoice for Your Sacred Journey 📄 - ${booking.bookingReference}`,
            HtmlBody: getEmailBody('Shobhit', booking.bookingReference, booking.tour.title, booking.totalAmount),
            Attachments: [
                {
                    Name: `Invoice-${booking.bookingReference}.pdf`,
                    Content: Buffer.from(pdfBuffer).toString('base64'),
                    ContentType: 'application/pdf',
                },
            ],
            MessageStream: 'outbound',
        });
        console.log('Email with receipt sent successfully:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

runTest();
