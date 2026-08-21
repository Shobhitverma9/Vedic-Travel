export interface Block {
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    text: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
}

export interface StatItem {
    value: string;
    label: string;
}

export interface DonationItem {
    image?: string;
    title?: string;
    description?: string;
    amount?: string;
    itemQty?: string;
    enableEMI?: boolean;
}

export interface Section {
    type: 'stats' | 'content' | 'donation' | 'grid' | 'media' | 'custom_donation' | 'image' | 'hero' | 'pricing_tiers';
    content: any;
}

export function renderEmailHtml(design: Section[]): string {
    if (!design || !Array.isArray(design)) return '';

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
            table { border-spacing: 0; border-collapse: collapse; }
            td { padding: 0; }
            img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; display: block; }
            a { color: #FF5722; text-decoration: none; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .content-pad { padding: 20px 30px; }
            .header-bg { background-color: #FFF8F3; padding: 30px; text-align: center; }
            .footer { padding: 20px; text-align: center; color: #888888; font-size: 12px; background-color: #f9f9f9; border-top: 1px solid #eeeeee; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #FF5722; color: #ffffff !important; border-radius: 6px; font-weight: bold; text-decoration: none; margin-top: 10px; }
        </style>
    </head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f4f4f4">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table class="container" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td class="header-bg">
                                <h1 style="color: #FF5722; margin: 0; font-size: 28px;">Vedic Travel</h1>
                                <p style="color: #7B2CBF; font-weight: bold; margin-top: 10px; font-size: 18px; margin-bottom: 0;">Your Spiritual Journey Begins Here</p>
                            </td>
                        </tr>

                        <!-- Body Content start -->
                        <tr>
                            <td class="content-pad">
    `;

    design.forEach(section => {
        html += renderSection(section);
    });

    html += `
                            </td>
                        </tr>
                        <!-- Body Content end -->

                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p style="margin: 0; font-size: 12px; line-height: 1.5;">© ${new Date().getFullYear()} Vedic Travel. All rights reserved.</p>
                                <p style="margin: 5px 0 0; font-size: 12px; line-height: 1.5;">You are receiving this email because you subscribed or booked a trip with us.</p>
                                <p style="margin: 5px 0 0; font-size: 12px; line-height: 1.5;"><a href="https://vedictravel.com/unsubscribe?email={{Email}}" style="color: #888888; text-decoration: underline;">Unsubscribe</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    return html;
}

function renderSection(section: Section): string {
    const { type, content } = section;
    let out = '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding-bottom: 25px;">';

    if (type === 'content') {
        const blocks = content.blocks || [];
        blocks.forEach((b: Block) => {
            const align = b.align || 'left';
            const color = b.color || '#333333';
            if (b.type === 'h1') {
                out += `<h1 style="text-align: ${align}; color: ${color}; font-size: 24px; margin-top: 0; margin-bottom: 15px;">${(b.text || '').replace(/\n/g, '<br/>')}</h1>`;
            } else if (b.type === 'h2') {
                out += `<h2 style="text-align: ${align}; color: ${color}; font-size: 20px; margin-top: 0; margin-bottom: 15px;">${(b.text || '').replace(/\n/g, '<br/>')}</h2>`;
            } else if (b.type === 'h3') {
                out += `<h3 style="text-align: ${align}; color: ${color}; font-size: 18px; margin-top: 0; margin-bottom: 10px;">${(b.text || '').replace(/\n/g, '<br/>')}</h3>`;
            } else if (b.type === 'h4') {
                out += `<h4 style="text-align: ${align}; color: ${color}; font-size: 16px; margin-top: 0; margin-bottom: 10px;">${(b.text || '').replace(/\n/g, '<br/>')}</h4>`;
            } else if (b.type === 'h5') {
                out += `<h5 style="text-align: ${align}; color: ${color}; font-size: 14px; margin-top: 0; margin-bottom: 5px;">${(b.text || '').replace(/\n/g, '<br/>')}</h5>`;
            } else if (b.type === 'h6') {
                out += `<h6 style="text-align: ${align}; color: ${color}; font-size: 12px; margin-top: 0; margin-bottom: 5px;">${(b.text || '').replace(/\n/g, '<br/>')}</h6>`;
            } else {
                out += `<p style="text-align: ${align}; color: ${color}; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 15px;">${(b.text || '').replace(/\\n/g, '<br/>')}</p>`;
            }
        });
    }

    else if (type === 'stats') {
        const items = content.items || [];
        out += `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px; border: 1px solid #eeeeee;"><tr>`;
        items.forEach((item: StatItem) => {
            out += `
            <td align="center" style="padding: 20px; width: ${100 / (items.length || 1)}%;">
                <div style="font-size: 24px; font-weight: bold; color: #FF5722; margin-bottom: 5px;">${item.value}</div>
                <div style="font-size: 14px; color: #666666; text-transform: uppercase;">${item.label}</div>
            </td>`;
        });
        out += `</tr></table>`;
    }

    else if (type === 'donation') {
        const items = content.items || [];
        out += `<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>`;
        
        items.forEach((item: DonationItem, idx: number) => {
            const imgSrc = item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; max-width: 250px; border-radius: 8px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">` : '';
            out += `
            <td width="50%" valign="top" style="padding: 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa; height: 100%;">
                    <tr>
                        <td style="padding: 20px; text-align: center;" valign="top">
                            ${imgSrc}
                            <h3 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 16px; line-height: 1.3;">${item.title || 'Tour / Yatra'}</h3>
                            ${item.description ? `<p style="margin-top: 0; margin-bottom: 15px; color: #666; font-size: 13px; line-height: 1.4;">${item.description}</p>` : ''}
                            <div style="font-size: 16px; font-weight: bold; color: #FF5722; margin-bottom: 15px;">₹${item.amount || '0'} ${item.itemQty ? `(${item.itemQty})` : ''}</div>
                            <a href="https://vedictravel.com" class="btn" style="padding: 10px 15px; font-size: 14px;">Book Now</a>
                        </td>
                    </tr>
                </table>
            </td>
            `;

            // Wrap row every 2 items
            if ((idx + 1) % 2 === 0 && idx < items.length - 1) {
                out += `</tr><tr>`;
            }
        });

        // Pad with empty cell if odd number of items
        if (items.length % 2 !== 0) {
            out += `<td width="50%" style="padding: 10px;"></td>`;
        }

        out += `</tr></table>`;
    }

    else if (type === 'grid') {
        const isReversed = content.reversed;
        const align = content.align || 'left';
        
        const textTd = `
        <td width="50%" valign="top" style="padding: 10px; text-align: ${align};">
            <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 15px 0;">${(content.text || '').replace(/\\n/g, '<br/>')}</p>
            ${content.buttonText && content.buttonLink ? `<a href="${content.buttonLink}" class="btn">${content.buttonText}</a>` : ''}
        </td>`;
        
        const imgTd = `
        <td width="50%" valign="top" style="padding: 10px;">
            ${content.image ? `<img src="${content.image}" style="width: 100%; border-radius: 8px;">` : ''}
        </td>`;

        out += `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                ${isReversed ? textTd + imgTd : imgTd + textTd}
            </tr>
        </table>`;
    }

    else if (type === 'media') {
        const videoUrl = content.videoUrl;
        if (videoUrl) {
            out += `
            <div style="text-align: center; background-color: #f1f1f1; padding: 30px; border-radius: 8px;">
                <p style="margin: 0 0 15px; font-size: 16px;">Watch our video update:</p>
                <a href="${videoUrl}" class="btn">Watch Video</a>
            </div>
            `;
        }
    }

    else if (type === 'custom_donation') {
        const title = content.title || 'Custom Amount';
        const bank = content.bankDetails || {};
        const upi = content.upiDetails || {};

        out += `
        <div style="border: 2px dashed #FF5722; border-radius: 8px; padding: 20px; background-color: #FFF8F3; text-align: center;">
            <h2 style="color: #FF5722; margin-top: 0; margin-bottom: 20px; font-size: 20px;">${title}</h2>
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" valign="top" style="padding: 10px; border-right: 1px solid #ddd; text-align: left;">
                        <h4 style="margin: 0 0 10px; font-size: 16px;">Bank Details</h4>
                        <p style="margin: 0 0 5px; font-size: 14px;"><strong>Bank:</strong> ${bank.bankName || 'N/A'}</p>
                        <p style="margin: 0 0 5px; font-size: 14px;"><strong>Name:</strong> ${bank.accountName || 'N/A'}</p>
                        <p style="margin: 0 0 5px; font-size: 14px;"><strong>A/C No:</strong> ${bank.accountNumber || 'N/A'}</p>
                        <p style="margin: 0 0 5px; font-size: 14px;"><strong>IFSC:</strong> ${bank.ifscCode || 'N/A'}</p>
                    </td>
                    <td width="50%" valign="top" style="padding: 10px; text-align: center;">
                        <h4 style="margin: 0 0 10px; font-size: 16px;">UPI / QR</h4>
                        ${upi.qrImage ? `<img src="${upi.qrImage}" style="width: 120px; margin: 0 auto 10px;">` : ''}
                        <p style="margin: 0; font-size: 14px;"><strong>UPI ID:</strong> ${upi.upiId || 'N/A'}</p>
                    </td>
                </tr>
            </table>
        </div>
        `;
    }
    else if (type === 'image') {
        const imageUrl = content.image;
        const link = content.link;
        const alt = content.alt || 'Email Image';
        if (imageUrl) {
            const imgHtml = `<img src="${imageUrl}" alt="${alt}" style="width: 100%; height: auto; display: block; border: 0; border-radius: 8px;">`;
            out += link ? `<a href="${link}" target="_blank">${imgHtml}</a>` : imgHtml;
        }
    }

    else if (type === 'hero') {
        const bgImage = content.backgroundImage;
        const title = content.title || '';
        const textColor = content.textColor || '#ffffff';
        
        if (bgImage) {
            out += `
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-image: url('${bgImage}'); background-size: cover; background-position: center; background-color: #333333; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td align="center" valign="middle" style="padding: 60px 40px; background-color: rgba(0,0,0,0.4);">
                        ${title ? `<h1 style="color: ${textColor}; font-size: 28px; margin: 0; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${title.replace(/\\n/g, '<br/>')}</h1>` : ''}
                    </td>
                </tr>
            </table>
            `;
        } else {
            out += `
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF8F3; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td align="center" valign="middle" style="padding: 60px 40px;">
                        ${title ? `<h1 style="color: #FF5722; font-size: 28px; margin: 0; line-height: 1.2;">${title.replace(/\\n/g, '<br/>')}</h1>` : ''}
                    </td>
                </tr>
            </table>
            `;
        }
    }
    else if (type === 'pricing_tiers') {
        const cards = content.cards || [];
        out += `<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>`;
        cards.forEach((card: any, idx: number) => {
            const headerColor = card.headerColor || '#FF9933';
            const title = card.title || '';
            const price = card.price || '';
            const features = card.features || [];
            const buttonText = card.buttonText || 'Donate Now';
            const headerImage = card.headerImage;
            const buttonLink = card.buttonLink || '#';
            
            // Standard email card width (approx 1/3 of 600px)
            out += `
            <td width="${Math.floor(100 / Math.min(cards.length, 3))}%" valign="top" style="padding: 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                    <tr>
                        <td valign="top">
                            ${headerImage ? `<img src="${headerImage}" style="width: 100%; display: block; border: 0;">` : `
                            <div style="background-color: ${headerColor}; padding: 15px; text-align: center;">
                                <h3 style="color: #ffffff; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${title}</h3>
                            </div>
                            `}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px;">₹${price}</div>
                            <div style="height: 1px; background-color: #f1f1f1; margin: 15px 0;"></div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                ${features.map((f: any) => `
                                <tr>
                                    <td valign="top" style="padding: 4px 0; font-size: 13px; color: #666; text-align: left;">
                                        <span style="color: ${headerColor}; font-weight: bold;">✓</span> ${f.text}
                                    </td>
                                </tr>
                                `).join('')}
                            </table>
                            <a href="${buttonLink}" class="btn" style="background-color: ${headerColor}; color: #ffffff !important; display: block; padding: 10px 5px; font-size: 14px;">${buttonText}</a>
                        </td>
                    </tr>
                </table>
            </td>
            `;
            
            // New row logic for multi-row pricing
            if ((idx + 1) % 3 === 0 && idx < cards.length - 1) {
                out += `</tr><tr>`;
            }
        });
        out += `</tr></table>`;
    }

    out += '</td></tr></table>';
    return out;
}
