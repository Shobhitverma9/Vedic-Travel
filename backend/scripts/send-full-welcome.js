require('dotenv').config();
const postmark = require('postmark');

const apiKey = process.env.POSTMARK_API_KEY;
const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'noreply@vedictravel.com';
const toEmail = 'shooffverm@gmail.com';

if (!apiKey) {
    console.error('POSTMARK_API_KEY is missing');
    process.exit(1);
}

const client = new postmark.ServerClient(apiKey);

const getEmailStyles = () => `
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
    .feature-grid { margin: 30px 0; }
    .feature-item { margin-bottom: 20px; padding: 15px; background: #fff8f3; border-radius: 12px; border: 1px solid #ffe8e0; display: table; width: 100%; box-sizing: border-box; }
    .feature-icon { font-size: 24px; display: table-cell; width: 40px; vertical-align: top; padding-right: 15px; }
    .feature-text { font-size: 14px; color: #4A5568; line-height: 1.6; display: table-cell; vertical-align: top; }
    .footer { background-color: #1A2332; color: #ffffff; padding: 40px 30px; text-align: center; }
    .footer-links a { color: #A0AEC0; text-decoration: none; margin: 0 10px; font-size: 13px; font-weight: 600; }
    .footer-social a { display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; line-height: 32px; font-size: 14px; text-decoration: none; color: white; }
    .footer-address { margin-top: 25px; font-size: 12px; color: #718096; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; }
`;

const getEmailHeader = (title, subtitle) => {
    const logoUrl = 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775119508/branding/vt-logo-email.png';
    return `
        <div class="header">
            <img src="${logoUrl}" alt="VedicTravel Logo" class="logo-img">
            <h1>${title}</h1>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
    `;
};

const getEmailFooter = () => `
    <div class="footer">
        <div style="font-size: 20px; font-weight: 800; color: #FF5722; margin-bottom: 10px;">VedicTravel</div>
        <div style="font-size: 13px; color: #A0AEC0; margin-bottom: 25px;">Connecting souls to sacred destinations</div>
        <div class="footer-links">
            <a href="https://vedictravel.com/tours">Explore Tours</a>
            <a href="https://vedictravel.com/blogs">Spiritual Blog</a>
            <a href="https://vedictravel.com/about">Our Mission</a>
        </div>
        <div class="footer-social">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Instagram">ig</a>
            <a href="#" title="YouTube">yt</a>
            <a href="#" title="WhatsApp">wa</a>
        </div>
        <div class="footer-address">
            <p><strong>VedicTravel PVT LTD</strong><br>Haridwar, Uttarakhand - 249401, India</p>
            <p style="margin-top: 10px; font-size: 10px; color: #4A5568;">© 2026 VedicTravel. All rights reserved.</p>
        </div>
    </div>
`;

const getWelcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${getEmailStyles()}</style>
</head>
<body>
    <div class="container">
        ${getEmailHeader('Welcome to VedicTravel!', 'Your Spiritual Journey Begins Here')}
        <div class="content">
            <div class="greeting">Namaste ${name},</div>
            <p class="message">
                We're thrilled to have you join the VedicTravel family! Your account has been successfully created. You're now part of a community dedicated to exploring the profound spiritual heritage of India through authentic, guided pilgrimage experiences.
            </p>
            
            <div class="why-us">
                <h3 style="color: #1A2332; margin-bottom: 15px;">Why Pilgrims Choose VedicTravel?</h3>
                <div class="feature-grid">
                    <div class="feature-item">
                        <div class="feature-icon">🛕</div>
                        <div class="feature-text"><strong>Sacred Authenticity</strong><br>Every yatra is designed by spiritual experts to ensure deep cultural and religious significance.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛡️</div>
                        <div class="feature-text"><strong>Safety & Comfort</strong><br>We prioritize your wellbeing with verified accommodations and experienced local support.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🧘</div>
                        <div class="feature-text"><strong>Expert Guidance</strong><br>Our guides don't just show the way; they share the stories and wisdom behind every stone.</div>
                    </div>
                </div>
            </div>

            <div class="trending">
                <h3 style="color: #FF5722; margin-bottom: 20px; text-align: center;">Trending Sacred Journeys</h3>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td width="48%" style="background: #FDF2F2; border-radius: 12px; padding: 15px; border: 1px solid #FFEBEB;">
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">Jagannatha Puri Yatra</div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">Experience the eternal grace of Lord Jagannath on the holy shores of Odisha.</div>
                            <a href="https://vedictravel.com/tours" style="color: #FF5722; font-size: 12px; font-weight: bold; text-decoration: none;">View Package →</a>
                        </td>
                        <td width="4%">&nbsp;</td>
                        <td width="48%" style="background: #F2FDF2; border-radius: 12px; padding: 15px; border: 1px solid #EBFFEB;">
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">Kashi Vishwanath</div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">Discover the light of liberation in the world's oldest living city, Varanasi.</div>
                            <a href="https://vedictravel.com/tours" style="color: #2E7D32; font-size: 12px; font-weight: bold; text-decoration: none;">View Package →</a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <center style="margin-top: 40px;">
                <a href="https://vedictravel.com" class="cta-button">Start Exploring Now</a>
            </center>
            
            <p class="message" style="margin-top: 30px; text-align: center; font-style: italic;">
                "Travel is more than the seeing of sights; it is a change that goes on, deep and permanent, in the ideas of living."
            </p>
        </div>
        ${getEmailFooter()}
    </div>
</body>
</html>`;

async function sendMail() {
    console.log('Sending full Welcome Email...');
    try {
        const result = await client.sendEmail({
            From: `Vedic Travel <${fromEmail}>`,
            To: toEmail,
            Subject: 'Welcome to VedicTravel - Your Spiritual Journey Begins!',
            HtmlBody: getWelcomeEmailTemplate('Shobhit'),
            MessageStream: 'outbound',
        });
        console.log('Full Welcome Email sent successfully:', result);
    } catch (error) {
        console.error('Failed to send full email:', error);
    }
}

sendMail();
