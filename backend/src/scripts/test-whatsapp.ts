import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WhatsappService } from '../notifications/whatsapp.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const whatsappService = app.get(WhatsappService);

    console.log('🧪 Testing all WhatsApp templates...\n');

    // Test 1: receipt (invoice doc)
    console.log('1️⃣  Testing receipt template...');
    await whatsappService.sendBookingInvoiceDoc(
        '917011147999',
        'https://tml-waba.s3.ap-south-1.amazonaws.com/uploads/24f4bc0e-8df4-4f4c-8935-08620e030048/other/1779261273211_usage-summary-69aaac823d3bc73f589a0af7-20260401.pdf',
        'booking-invoice.pdf',
        { customerName: 'Shobhit Verma', bookingReference: 'VT-2026-TEST-001' }
    );

    // Test 2: booking_confirmation
    console.log('2️⃣  Testing booking_confirmation template...');
    await whatsappService.sendBookingConfirmation('917011147999', 'Shobhit Verma', {
        bookingReference: 'VT-2026-TEST-001',
        tourName: 'Char Dham Yatra 2026',
        travelDate: '15 June 2026',
        numberOfTravelers: 2,
        totalAmount: 45000,
        paidAmount: 45000,
    });

    // Test 3: inquiry_acknowledgement
    console.log('3️⃣  Testing inquiry_acknowledgement template...');
    await whatsappService.sendInquiryAcknowledgement('917011147999', 'Shobhit Verma', {
        tourName: 'Vaishno Devi Yatra',
    });

    // Test 4: payment_failure
    console.log('4️⃣  Testing payment_failure template...');
    await whatsappService.sendPaymentFailure('917011147999', 'Shobhit Verma', {
        bookingReference: 'VT-2026-TEST-001',
        tourName: 'Char Dham Yatra 2026',
        totalAmount: 45000,
    });

    console.log('\n✅ All tests completed! Check your WhatsApp.');
    await app.close();
}

bootstrap();
