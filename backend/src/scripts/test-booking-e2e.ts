import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { WhatsappService } from '../notifications/whatsapp.service';
import { InvoiceService } from '../email/invoice.service';
import { ConfigService } from '@nestjs/config';

const TEST_PHONE = '919717440062';
const TEST_EMAIL = 'test@vedictravel.com';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const whatsappService = app.get(WhatsappService);
    const invoiceService = app.get(InvoiceService);
    const configService = app.get(ConfigService);

    // ── 1. Fetch a real tour from the DB ─────────────────────────────────────
    const tourModel = app.get(getModelToken('Tour'));
    const tour = await tourModel.findOne({ isActive: { $ne: false } }).lean();

    if (!tour) {
        console.error('❌ No active tour found in DB. Please seed some tours first.');
        await app.close();
        return;
    }
    console.log(`\n✅ Using tour: "${tour.title}" (${tour._id})`);

    // ── 2. Create a test booking in the DB ────────────────────────────────────
    const bookingModel: Model<any> = app.get(getModelToken('Booking'));
    const bookingReference = `VT-TEST-${Date.now()}`;
    const travelDate = new Date('2026-08-15');

    const testBooking = await bookingModel.create({
        tour: tour._id,
        numberOfTravelers: 2,
        travelDate,
        totalAmount: 45000,
        paidAmount: 45000,
        paymentStatus: 'success',
        bookingStatus: 'confirmed',
        paymentId: 'PAYU-TEST-123456',
        payuTransactionId: `TXN${Date.now()}`,
        paymentMethod: 'CC',
        bookingReference,
        email: TEST_EMAIL,
        phone: TEST_PHONE,
        billingAddress: {
            title: 'Mr',
            firstName: 'Shobhit',
            lastName: 'Verma',
            addressLine: '123 Test Lane, Sector 18',
            state: 'Uttar Pradesh',
            city: 'Noida',
            pincode: '201301',
            email: TEST_EMAIL,
            mobile: TEST_PHONE,
        },
        travelerDetails: [
            { name: 'Shobhit Verma', age: 28, gender: 'Male', idProof: 'Aadhaar' },
            { name: 'Test Traveler', age: 25, gender: 'Female', idProof: 'Passport' },
        ],
        isGuest: true,
        notificationsSent: true,   // prevent any cron re-triggers
    });

    console.log(`✅ Test booking created: ${bookingReference} (${testBooking._id})\n`);

    // Build a populated booking object for invoice generation
    const populatedBooking = {
        ...testBooking.toObject(),
        tour: { title: tour.title, _id: tour._id },
    };

    const recipientName = 'Shobhit Verma';
    const travelDateFormatted = travelDate.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
    });
    const adminWhatsappNumber = configService.get<string>('ADMIN_WHATSAPP_NUMBER') || '918587800062';

    // ── 3. Generate PDF invoice ───────────────────────────────────────────────
    console.log('📄 Generating PDF invoice...');
    let invoiceUrl: string | null = null;
    try {
        const pdfBuffer = await invoiceService.generateInvoicePdf(populatedBooking, 45000);
        const fileName = `invoice-${bookingReference}`;
        invoiceUrl = await invoiceService.uploadToCloudinary(pdfBuffer, fileName);
        console.log(`✅ Invoice uploaded: ${invoiceUrl}\n`);
    } catch (err) {
        console.error('❌ Invoice generation failed:', err.message);
    }

    // ── 4. Send WhatsApp: booking_confirmation → customer ─────────────────────
    console.log('📱 [1/3] Sending booking_confirmation to customer...');
    const confirmResult = await whatsappService.sendBookingConfirmation(TEST_PHONE, recipientName, {
        bookingReference,
        tourName: tour.title,
        travelDate: travelDateFormatted,
        numberOfTravelers: 2,
        totalAmount: 45000,
        paidAmount: 45000,
    });
    console.log(confirmResult ? '✅ Customer booking_confirmation sent!' : '❌ Failed');

    // ── 5. Send WhatsApp: receipt (PDF invoice) → customer ────────────────────
    if (invoiceUrl) {
        console.log('\n📱 [2/3] Sending receipt (PDF) to customer...');
        const receiptResult = await whatsappService.sendBookingInvoiceDoc(
            TEST_PHONE,
            invoiceUrl,
            `invoice-${bookingReference}.pdf`,
            { customerName: recipientName, bookingReference },
        );
        console.log(receiptResult ? '✅ Customer receipt sent!' : '❌ Failed');
    }

    // ── 6. Send WhatsApp: booking_confirmation → admin ────────────────────────
    console.log('\n📱 [3/3] Sending booking_confirmation to admin...');
    const adminResult = await whatsappService.sendBookingConfirmation(
        adminWhatsappNumber,
        `Admin (${recipientName})`,
        {
            bookingReference,
            tourName: tour.title,
            travelDate: travelDateFormatted,
            numberOfTravelers: 2,
            totalAmount: 45000,
            paidAmount: 45000,
        }
    );
    console.log(adminResult ? '✅ Admin booking_confirmation sent!' : '❌ Failed');

    // ── 7. Clean up test booking ──────────────────────────────────────────────
    await bookingModel.findByIdAndDelete(testBooking._id);
    console.log(`\n🧹 Test booking ${bookingReference} cleaned up from DB.`);
    console.log('\n🎉 End-to-end booking notification test complete! Check WhatsApp.\n');

    await app.close();
}

bootstrap().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
