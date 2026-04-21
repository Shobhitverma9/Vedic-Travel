import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { InvoiceService } from '../email/invoice.service';

// 1. Load Environment Variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * 2. Mock NestJS ConfigService
 */
class MockConfigService {
  get<T>(key: string): T {
    return process.env[key] as any;
  }
}

async function runStandaloneTest() {
  console.log('🚀 Starting Standalone Notification Test Script...');
  console.log('--------------------------------------------------');

  const mockConfig = new MockConfigService() as unknown as ConfigService;
  const emailService = new EmailService(mockConfig);
  const invoiceService = new InvoiceService(mockConfig);

  const testEmail = 'shooffverm@gmail.com';
  const testName = 'Shobhit Verma';

  console.log(`📬 Targeting email: ${testEmail}`);

  const dummyBooking = {
    bookingReference: 'VT-TEST-2024-888',
    totalAmount: 18500,
    paidAmount: 5000,
    numberOfTravelers: 2,
    travelDate: new Date('2024-12-25'),
    payuTransactionId: 'PAYU_TEST_99999',
    tour: {
        title: 'Jagannatha Puri Yatra',
        slug: 'jagannatha-puri-yatra-standard-package'
    },
    user: {
        name: testName,
        email: testEmail,
        phone: '+919876543210'
    }
  };

  try {
    // 1. OTP Notifications
    console.log('🔹 Testing OTP Mails...');
    await emailService.sendOTPEmail(testEmail, '111111', testName);
    await emailService.sendLoginOTPEmail(testEmail, '222222', testName);

    // 2. Welcome Mail
    console.log('🔹 Testing Welcome Mail...');
    await emailService.sendWelcomeEmail(testEmail, testName);

    // 3. Booking Confirmation
    console.log('🔹 Testing Booking Confirmation...');
    await emailService.sendBookingConfirmationEmail(testEmail, testName, {
        bookingId: 'DUMMY_ID_123',
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title,
        travelDate: dummyBooking.travelDate.toLocaleDateString('en-IN'),
        numberOfTravelers: dummyBooking.numberOfTravelers,
        totalAmount: dummyBooking.totalAmount,
        paidAmount: dummyBooking.paidAmount
    });

    // 4. Payment Failure / Cancellation
    console.log('🔹 Testing Payment Failure...');
    await emailService.sendPaymentFailureEmail(testEmail, testName, {
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title,
        totalAmount: dummyBooking.totalAmount,
        transactionId: 'TXN_FAIL_TEST'
    });

    console.log('🔹 Testing Cancellation...');
    await emailService.sendBookingCancellationEmail(testEmail, testName, {
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title,
        travelDate: dummyBooking.travelDate.toLocaleDateString(),
        numberOfTravelers: dummyBooking.numberOfTravelers,
        totalAmount: dummyBooking.totalAmount,
        cancellationReason: 'Test cancellation requested by user'
    });

    // 5. Automated Reminders
    console.log('🔹 Testing Trip Reminder (3 Days Before)...');
    await emailService.sendTripReminderEmail(testEmail, testName, {
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title,
        travelDate: dummyBooking.travelDate.toLocaleDateString(),
        numberOfTravelers: dummyBooking.numberOfTravelers
    });

    console.log('🔹 Testing Pending Payment Follow-up...');
    await emailService.sendPendingPaymentReminderEmail(testEmail, testName, {
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title,
        totalAmount: dummyBooking.totalAmount
    });

    // 6. AD-HOC Feedback
    console.log('🔹 Testing Post-Trip Feedback Request...');
    await emailService.sendFeedbackRequestEmail(testEmail, testName, {
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title
    });

    // 7. 🔥 PREMIUM RECEIPT GENERATION & ATTACHMENT FLOW
    console.log('📄 Generating High-Fidelity PDF Receipt (Puppeteer)...');
    const pdfBuffer = await invoiceService.generateInvoicePdf(dummyBooking);
    console.log('✅ PDF Buffer generated! Length:', pdfBuffer.length);

    console.log('☁️ Uploading to Cloudinary for permanent storage...');
    const invoiceUrl = await invoiceService.uploadToCloudinary(pdfBuffer, `test-invoice-${dummyBooking.bookingReference}`);
    console.log('🔗 Invoice URL:', invoiceUrl);

    console.log('📨 Dispatching Multi-Channel Invoice Email (with attachment)...');
    await emailService.sendInvoiceEmail(testEmail, testName, {
        bookingReference: dummyBooking.bookingReference,
        tourName: dummyBooking.tour.title,
        totalAmount: dummyBooking.totalAmount,
        invoiceUrl: invoiceUrl
    }, pdfBuffer);

    console.log('--------------------------------------------------');
    console.log('✨ ALL TESTS DISPATCHED! Please check shooffverm@gmail.com ✨');

  } catch (err) {
    console.error('❌ Standalone Test Failed:', err);
  }
}

runStandaloneTest();
