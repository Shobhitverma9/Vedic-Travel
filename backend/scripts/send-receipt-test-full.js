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
        month: 'long',
        year: 'numeric',
    });

    const travelerName = booking.travelerDetails?.[0]?.name || 'Valued Guest';
    const tourTitle = booking.tour?.title || 'Spiritual Yatra';
    const amount = booking.totalAmount.toLocaleString('en-IN');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; color: #1A2332; margin: 0; padding: 40px; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F5F5F5; padding-bottom: 30px; margin-bottom: 40px; }
        .logo img { max-width: 200px; height: auto; }
        .invoice-label { text-align: right; }
        .invoice-label h1 { margin: 0; font-size: 32px; color: #7B2CBF; letter-spacing: -1px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px; }
        .section-title { font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 12px; font-weight: 700; }
        .info-box p { margin: 4px 0; font-size: 15px; line-height: 1.5; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { text-align: left; background: #F8F9FA; padding: 14px 20px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .table td { padding: 20px; border-bottom: 1px solid #F0F0F0; font-size: 15px; }
        .total-section { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
        .total-row.grand-total { margin-top: 10px; padding-top: 20px; border-top: 2px solid #F5F5F5; font-size: 20px; font-weight: 700; color: #FF5722; }
        .status-badge { display: inline-block; background: #E8F5E9; color: #2E7D32; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .footer { margin-top: 100px; text-align: center; color: #999; font-size: 13px; border-top: 1px solid #F5F5F5; padding-top: 30px; }
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
            <p>${booking.email}</p>
        </div>
        <div class="info-box" style="text-align: right;">
            <div class="section-title">Payment Details</div>
            <p>Date: ${date}</p>
            <p>Transaction ID: ${booking.payuTransactionId || 'N/A'}</p>
            <p><span class="status-badge">Paid Successfully</span></p>
        </div>
    </div>
    <table class="table">
        <thead><tr><th>Description</th><th>Travelers</th><th style="text-align: right;">Amount</th></tr></thead>
        <tbody>
            <tr>
                <td><strong>${tourTitle}</strong><br><span style="font-size: 13px; color: #666;">Yatra Date: ${new Date(booking.travelDate).toLocaleDateString('en-IN')}</span></td>
                <td>${booking.numberOfTravelers} Person(s)</td>
                <td style="text-align: right;">₹${amount}</td>
            </tr>
        </tbody>
    </table>
    <div class="total-section">
        <div class="total-row grand-total"><span>Total Paid</span><span>₹${amount}</span></div>
    </div>
    <div class="footer">
        <p>This is a computer-generated receipt. No signature is required.</p>
        <p><strong>VedicTravel</strong> &bull; Haridwar, Uttarakhand &bull; www.vedictravel.in</p>
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
