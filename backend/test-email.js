const postmark = require('postmark');
require('dotenv').config();

const apiKey = process.env.POSTMARK_API_KEY;
const fromEmail = process.env.POSTMARK_FROM_EMAIL;
const toEmail = process.argv[2] || 'test@example.com';

if (!apiKey) {
    console.error('ERROR: POSTMARK_API_KEY not found in .env');
    process.exit(1);
}

console.log('Using API Key:', apiKey.substring(0, 8) + '...');
console.log('From Email:', fromEmail);
console.log('To Email:', toEmail);

const client = new postmark.ServerClient(apiKey);

client.sendEmail({
    "From": fromEmail,
    "To": toEmail,
    "Subject": "Postmark Test from Vedic Travel",
    "TextBody": "This is a test email from the Vedic Travel diagnostic script.",
    "MessageStream": "outbound"
}).then(response => {
    console.log('SUCCESS:', response);
}).catch(error => {
    console.error('FAILED:', error.message);
    if (error.code) console.error('Error Code:', error.code);
});
