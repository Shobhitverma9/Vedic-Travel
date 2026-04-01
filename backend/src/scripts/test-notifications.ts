import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmailService } from '../email/email.service';
import { InvoiceService } from '../email/invoice.service';
import { WhatsappService } from '../notifications/whatsapp.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    console.log('🚀 Starting VedicTravel Notification Test Script...');
    
    // Create standalone context to access services
    const app = await NestFactory.createApplicationContext(AppModule);
    const emailService = app.get(EmailService);
    const invoiceService = app.get(InvoiceService);
    const configService = app.get(ConfigService);
    
    const testEmail = configService.get('ADMIN_EMAIL') || 'admin@vedictravel.com';
    const testName = 'Shobhit Verma (Test)';
    
    console.log(`📧 Sending all test emails to: ${testEmail}`);

    const dummyBooking = {
        bookingReference: 'VT-TEST-2024-001',
        totalAmount: 25000,
        numberOfTravelers: 2,
        travelDate: new Date('2024-12-25'),
        payuTransactionId: 'PAYU_TEST_12345',
        tour: {
            title: 'Himalayan Spiritual Yatra',
            slug: 'himalayan-yatra'
        },
        user: {
            name: testName,
            email: testEmail,
            phone: '+919999999999'
        }
    };

    try {
        // 1. Test OTP Emails
        console.log('- Sending OTP Email...');
        await emailService.sendOTPEmail(testEmail, '123456', testName);
        
        console.log('- Sending Login OTP Email...');
        await emailService.sendLoginOTPEmail(testEmail, '654321', testName);

        // 2. Test Welcome Email
        console.log('- Sending Welcome Email...');
        await emailService.sendWelcomeEmail(testEmail, testName);

        // 3. Test Booking Confirmation Email
        console.log('- Sending Booking Confirmation...');
        await emailService.sendBookingConfirmationEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title,
            travelDate: dummyBooking.travelDate.toLocaleDateString(),
            numberOfTravelers: dummyBooking.numberOfTravelers,
            totalAmount: dummyBooking.totalAmount
        });

        // 4. Test Booking Cancellation
        console.log('- Sending Cancellation Email...');
        await emailService.sendBookingCancellationEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title,
            travelDate: dummyBooking.travelDate.toLocaleDateString(),
            numberOfTravelers: dummyBooking.numberOfTravelers,
            totalAmount: dummyBooking.totalAmount,
            cancellationReason: 'Test cancellation requested by user.'
        });

        // 5. Test Inquiry Acknowledgement
        console.log('- Sending Inquiry Acknowledgement...');
        await emailService.sendInquiryAcknowledgementEmail(testEmail, testName, {
            tourName: dummyBooking.tour.title,
            adults: 2,
            children: 1,
            infants: 0,
            message: 'Looking for a spiritual retreat in December.'
        });

        // 6. Test Payment Failure
        console.log('- Sending Payment Failure Email...');
        await emailService.sendPaymentFailureEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title,
            totalAmount: dummyBooking.totalAmount,
            transactionId: 'TXN_FAIL_001'
        });

        // 7. Test Reminders
        console.log('- Sending Trip Reminder...');
        await emailService.sendTripReminderEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title,
            travelDate: dummyBooking.travelDate.toLocaleDateString(),
            numberOfTravelers: dummyBooking.numberOfTravelers
        });

        console.log('- Sending Pending Payment Reminder...');
        await emailService.sendPendingPaymentReminderEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title,
            totalAmount: dummyBooking.totalAmount
        });

        // 8. Test Post-Trip Feedback
        console.log('- Sending Feedback Request...');
        await emailService.sendFeedbackRequestEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title
        });

        // 9. TEST RECEIPT GENERATION & EMAIL (CRITICAL)
        console.log('📄 Testing PDF Receipt Generation (Puppeteer)...');
        const pdfBuffer = await invoiceService.generateInvoicePdf(dummyBooking);
        console.log('✅ PDF Buffer generated successfully.');

        console.log('☁️ Uploading to Cloudinary...');
        const invoiceUrl = await invoiceService.uploadToCloudinary(pdfBuffer, `test-invoice-${Date.now()}`);
        console.log(`✅ Uploaded! View here: ${invoiceUrl}`);

        console.log('- Sending Invoice Email with PDF Attachment...');
        await emailService.sendInvoiceEmail(testEmail, testName, {
            bookingReference: dummyBooking.bookingReference,
            tourName: dummyBooking.tour.title,
            totalAmount: dummyBooking.totalAmount,
            invoiceUrl: invoiceUrl
        }, pdfBuffer);

        console.log('\n✨ ALL TEST NOTIFICATIONS SENT SUCCESSFULY! ✨');
        console.log('Please check your inbox at:', testEmail);

    } catch (error) {
        console.error('\n❌ Error during notification tests:', error);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();
