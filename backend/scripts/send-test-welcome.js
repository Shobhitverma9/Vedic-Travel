require('dotenv').config();
const postmark = require('postmark');

async function sendTestWelcome() {
    const apiKey = process.env.POSTMARK_API_KEY;
    const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'noreply@vedictravel.com';
    const toEmail = 'shooffverm@gmail.com';

    if (!apiKey) {
        console.error('POSTMARK_API_KEY is missing');
        return;
    }

    const client = new postmark.ServerClient(apiKey);

    const logoUrl = 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775119508/branding/vt-logo-email.png';
    
    // Extracted styles and template from updated email.service.ts
    const styles = `
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
        .footer { background-color: #1A2332; color: #ffffff; padding: 40px 30px; text-align: center; }
    `;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUrl}" alt="VedicTravel Logo" class="logo-img">
            <h1>Welcome to VedicTravel!</h1>
            <p>Your Spiritual Journey Begins Here</p>
        </div>
        <div class="content">
            <div class="greeting">Namaste!</div>
            <p class="message">
                This is a test email to showcase the new header gradient adjustment. 
                The background has been updated to a deep purple to ensure your orange logo stands out perfectly.
            </p>
            <center style="margin-top: 40px;">
                <a href="https://vedictravel.com" class="cta-button">Explore Sacred Journeys</a>
            </center>
        </div>
        <div class="footer">
            <div style="font-size: 20px; font-weight: 800; color: #FF5722; margin-bottom: 10px;">VedicTravel</div>
            <div style="font-size: 12px; color: #A0AEC0;">© 2026 VedicTravel. All rights reserved.</div>
        </div>
    </div>
</body>
</html>`;

    try {
        console.log(`Sending test email to ${toEmail}...`);
        const result = await client.sendEmail({
            From: `Vedic Travel <${fromEmail}>`,
            To: toEmail,
            Subject: 'VedicTravel - New Header Design Test',
            HtmlBody: htmlBody,
            TextBody: 'Welcome to VedicTravel! This is a test of the new header design.',
            MessageStream: 'outbound',
        });
        console.log('Test email sent successfully:', result);
    } catch (error) {
        console.error('Failed to send test email:', error);
    }
}

sendTestWelcome();
