const dotenv = require('dotenv');
const postmark = require('postmark');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');

// 1. Load configuration
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
    apiKey: process.env.POSTMARK_API_KEY,
    fromEmail: process.env.POSTMARK_FROM_EMAIL || 'noreply@vedictravel.com',
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
};

cloudinary.config(config.cloudinary);
const client = new postmark.ServerClient(config.apiKey);

const testEmail = 'shooffverm@gmail.com';
const testName = 'Shobhit Verma';
const dummyBooking = {
    bookingReference: 'VT-TEST-PURI-108',
    totalAmount: 18500,
    numberOfTravelers: 2,
    travelDate: new Date('2024-12-25'),
    payuTransactionId: 'PAYU_TEST_SAMPLE_ID',
    tour: { title: 'Jagannatha Puri Yatra Standard Package' },
    user: { name: testName, email: testEmail, phone: '+919876543210' }
};

// --- PREMIUM HTML TEMPLATES ---

function getInvoiceHtml(booking) {
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const travelerName = booking.user?.name || 'Valued Guest';
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
        .logo { font-size: 28px; font-weight: 700; color: #FF5722; }
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
        <div class="logo">🕉️ VedicTravel</div>
        <div class="invoice-label">
            <h1>RECEIPT</h1>
            <p style="color: #666; margin: 4px 0;">#${booking.bookingReference}</p>
        </div>
    </div>
    <div class="details-grid">
        <div class="info-box">
            <div class="section-title">Billed To</div>
            <p><strong>${travelerName}</strong></p>
            <p>${booking.user?.email || ''}</p>
            <p>${booking.user?.phone || ''}</p>
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
                <td><strong>${tourTitle}</strong><br><span style="font-size: 13px; color: #666;">Yatra Date: ${booking.travelDate.toLocaleDateString('en-IN')}</span></td>
                <td>${booking.numberOfTravelers} Person(s)</td>
                <td style="text-align: right;">₹${amount}</td>
            </tr>
        </tbody>
    </table>
    <div class="total-section">
        <div class="total-row"><span style="color: #666;">Subtotal</span><span>₹${amount}</span></div>
        <div class="total-row"><span style="color: #666;">Tax (0%)</span><span>₹0.00</span></div>
        <div class="total-row grand-total"><span>Total Paid</span><span>₹${amount}</span></div>
    </div>
    <div class="footer">
        <p>This is a computer-generated receipt. No signature is required.</p>
        <p><strong>VedicTravel</strong> &bull; Connecting souls to sacred destinations &bull; www.vedictravel.in</p>
    </div>
</body>
</html>`;
}

function getInvoiceEmailTemplate(name, details) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #FFF8F3; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7B2CBF 0%, #FF5722 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #1A2332; margin-bottom: 20px; font-weight: bold; }
        .info-card { background: #F8F9FA; border-left: 4px solid #7B2CBF; padding: 20px; border-radius: 4px; margin-bottom: 30px; }
        .info-card p { margin: 8px 0; color: #444; font-size: 15px; }
        .cta-box { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background: #FF5722; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .footer { background-color: #1A2332; color: #fff; padding: 24px 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>🕉️ Your Invoice is Ready</h1></div>
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p>Thank you for choosing VedicTravel. We have successfully processed your payment.</p>
            <div class="info-card">
                <p><strong>Booking Reference:</strong> ${details.bookingReference}</p>
                <p><strong>Tour/Yatra:</strong> ${details.tourName}</p>
                <p><strong>Amount Paid:</strong> ₹${details.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <p>We've attached the official PDF receipt to this email.</p>
            ${details.invoiceUrl ? `<div class="cta-box"><a href="${details.invoiceUrl}" class="cta-button">View Receipt Online</a></div>` : ''}
        </div>
        <div class="footer"><p>© 2026 VedicTravel. All rights reserved.</p></div>
    </div>
</body>
</html>`;
}

// --- TEST RUNNER ---

async function sendAllTestEmails() {
    console.log('🚀 Starting VedicTravel PREMIUM Notification Test Suite...');
    console.log('--------------------------------------------------');

    try {
        // --- 0. Generate PREMIUM Receipt PDF ---
        console.log('📄 Step 0: Rendering PREMIUM PDF Receipt (Puppeteer)...');
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
        const page = await browser.newPage();
        const receiptHtml = getInvoiceHtml(dummyBooking);
        await page.setContent(receiptHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' } });
        await browser.close();
        console.log('✅ PDF Generated Successfully.');

        console.log('☁️ Step 1: Uploading to Cloudinary...');
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'test_receipts', resource_type: 'raw', public_id: `premium_test_${dummyBooking.bookingReference}` },
                (error, result) => error ? reject(error) : resolve(result)
            );
            streamifier.createReadStream(pdfBuffer).pipe(stream);
        });
        const invoiceUrl = uploadResult.secure_url;
        console.log(`✅ Uploaded: ${invoiceUrl}`);

        console.log('📨 Step 2: Dispatching Test Emails...');

        const send = async (subject, html, recipient = testEmail, attachment = null) => {
            await client.sendEmail({
                From: config.fromEmail,
                To: recipient,
                Subject: subject,
                HtmlBody: html,
                TextBody: `VedicTravel Notification: ${subject}`,
                MessageStream: 'outbound',
                Attachments: attachment ? [{
                    Name: `Invoice-${dummyBooking.bookingReference}.pdf`,
                    Content: Buffer.from(attachment).toString('base64'),
                    ContentType: 'application/pdf'
                }] : []
            });
            console.log(`✅ Sent: ${subject}`);
        };

        // 1. Full Invoice Email (Premium Template)
        await send(`Invoice for Your Sacred Journey 📄 - ${dummyBooking.bookingReference}`, 
            getInvoiceEmailTemplate(testName, { 
                bookingReference: dummyBooking.bookingReference, 
                tourName: dummyBooking.tour.title, 
                totalAmount: dummyBooking.totalAmount, 
                invoiceUrl: invoiceUrl 
            }), 
            testEmail, pdfBuffer);

        // 2. Simple OTP for verification
        await send('Verify Your Account 🕉️', `<h1>123456</h1><p>Your one-time password for VedicTravel.</p>`);

        console.log('--------------------------------------------------');
        console.log('✨ PREMIUM TESTS DISPATCHED to ' + testEmail);
        console.log('Please check the PDF attachment carefully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

sendAllTestEmails();
