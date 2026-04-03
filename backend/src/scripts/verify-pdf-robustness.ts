import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { InvoiceService } from '../email/invoice.service';

dotenv.config({ path: path.join(__dirname, '../../.env') });

class MockConfigService {
  get<T>(key: string): T {
    return process.env[key] as any;
  }
}

async function verifyPdf() {
  console.log('🧪 Starting PDF Robustness Verification...');
  
  const mockConfig = new MockConfigService() as unknown as ConfigService;
  const invoiceService = new InvoiceService(mockConfig);

  const dummyBooking = {
    bookingReference: 'VT-VERIFY-999',
    totalAmount: 25000.50,
    numberOfTravelers: 3,
    travelDate: new Date('2025-01-15'),
    payuTransactionId: 'VERIFY_TXN_001',
    user: {
        name: 'Verification Test User',
        email: 'test@example.com',
        phone: '+91 9999999999'
    }
  };

  try {
    console.log('⌛ Generating PDF...');
    const pdfBuffer = await invoiceService.generateInvoicePdf(dummyBooking);
    
    console.log('✅ PDF Generation Completed');
    console.log(`📊 Buffer Size: ${pdfBuffer.length} bytes`);
    
    if (pdfBuffer.length < 1000) {
      throw new Error('❌ PDF is suspiciously small (< 1kb). It might be blank or corrupted.');
    }

    // Check for PDF Magic Number %PDF-
    const header = pdfBuffer.toString('ascii', 0, 5);
    console.log(`🔍 PDF Header Check: "${header}"`);
    
    if (header !== '%PDF-') {
      throw new Error('❌ Malformed PDF: Missing %PDF- header.');
    }

    // Check Base64 consistency
    const b64 = Buffer.from(pdfBuffer).toString('base64');
    console.log(`🔑 Base64 Length: ${b64.length}`);
    
    if (b64.includes(' ')) {
      throw new Error('❌ Base64 contains spaces - this will corrupt the email attachment.');
    }

    // Save to temp file for manual inspection if needed
    const tempPath = path.join(__dirname, '../../temp_verify_receipt.pdf');
    fs.writeFileSync(tempPath, pdfBuffer);
    console.log(`💾 Saved PDF for inspection: ${tempPath}`);
    
    console.log('✨ VERIFICATION SUCCESSFUL! PDF looks robust. ✨');
  } catch (err) {
    console.error('❌ VERIFICATION FAILED:', err);
    process.exit(1);
  }
}

// Check if we can run this (need Puppeteer installed)
verifyPdf();
