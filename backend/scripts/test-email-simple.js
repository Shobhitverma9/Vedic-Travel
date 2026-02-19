require('dotenv').config();
const postmark = require('postmark');

async function testEmail() {
    console.log('Testing Email Sending...');
    const apiKey = process.env.POSTMARK_API_KEY;
    const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'noreply@vedictravel.com';

    console.log(`API Key present: ${!!apiKey}`);
    console.log(`From Email: ${fromEmail}`);

    if (!apiKey) {
        console.error('POSTMARK_API_KEY is missing');
        return;
    }

    const client = new postmark.ServerClient(apiKey);

    try {
        const result = await client.sendEmail({
            From: fromEmail,
            To: 'admin@vedictravel.com', // Trying same domain to bypass pending account restriction
            // Better to use a standard test email or log what I'm doing.
            // I'll use the ADMIN_EMAIL from env if possible, or just 'test@example.com' which will fail if not verified?
            // Postmark only sends to verified domains or the sink domain? 
            // Wait, I can't know the user's email to test with.
            // I will use 'shobhita@example.com' effectively? No.
            // I'll check the .env for ADMIN_EMAIL and use that as TO address.
            Subject: 'Test Email from VedicTravel Script',
            HtmlBody: '<strong>Hello</strong> dear user.',
            TextBody: 'Hello dear user.',
            MessageStream: 'outbound',
        });
        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

testEmail();
