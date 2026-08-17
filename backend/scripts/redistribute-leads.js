/**
 * redistribute-leads.js
 * Redistributes existing inquiries & bookings across more tour packages
 * with a realistic, varied distribution. Also spreads dates more naturally
 * so some months have fewer entries (gaps/blank days).
 *
 * Run: node scripts/redistribute-leads.js
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";

// Expanded tour pool with realistic weights (must sum to 100)
const TOURS = [
  { id: '69d1103af870c24086113ff2', name: 'Varanasi-Prayagraj-Ayodhya Tour Package', weight: 14 },
  { id: '69972d35103be0bdab9e3e76', name: 'Varanasi Ayodhya Prayagraj Golden UP Yatra Standard', weight: 8 },
  { id: '69ce33efe4884206cff779fb', name: 'Chardham Yatra by Road Ex-Delhi', weight: 10 },
  { id: '699048f96cb4404dddf9c4b5', name: 'Premium Char Dham Yatra by Helicopter', weight: 6 },
  { id: '69d0eebcc5c6940d878e7430', name: 'Bali Luxury Escape: Beaches, Culture & Indulgence', weight: 9 },
  { id: '699734450c21731fde67876f', name: 'Bali Temple Trail Standard Package', weight: 7 },
  { id: 'KEDARNATH_DUMMY_1', name: 'Kedarnath Yatra by Helicopter - Ex Delhi', weight: 8 },
  { id: 'KEDARNATH_DUMMY_2', name: 'Do Dham Yatra - Kedarnath & Badrinath', weight: 6 },
  { id: 'RAJASTHAN_DUMMY_1', name: 'Royal Rajasthan - Jaipur Jodhpur Udaipur 7N/8D', weight: 7 },
  { id: 'RAJASTHAN_DUMMY_2', name: 'Ranthambore & Jaipur Wildlife Heritage Tour', weight: 4 },
  { id: 'KASHMIR_DUMMY_1', name: 'Kashmir Grand Tour - Srinagar Gulmarg Pahalgam', weight: 9 },
  { id: 'KASHMIR_DUMMY_2', name: 'Kashmir Tulip & Shikara Special Package', weight: 5 },
  { id: 'THAILAND_DUMMY_1', name: 'Thailand Highlights - Bangkok Pattaya Phuket', weight: 4 },
  { id: 'SOUTH_DUMMY_1', name: 'Kerala Backwaters & Hill Stations Tour', weight: 3 },
];

function getTourByWeight() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const tour of TOURS) {
    cumulative += tour.weight;
    if (rand <= cumulative) return tour;
  }
  return TOURS[0];
}

function naturalRandomDate(start, end) {
  const totalMs = end.getTime() - start.getTime();
  const clusterCenter = start.getTime() + Math.random() * totalMs;
  const jitter = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const jitterMs = jitter * (totalMs * 0.15);
  const finalTime = Math.min(end.getTime(), Math.max(start.getTime(), clusterCenter + jitterMs));
  return new Date(finalTime);
}

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('vedictravel');
    const bookingsCol = db.collection('bookings');
    const inquiriesCol = db.collection('inquiries');
    const startDate = new Date('2025-01-01T00:00:00Z');
    const endDate = new Date('2026-08-13T00:00:00Z');

    // --- REDISTRIBUTE INQUIRIES ---
    console.log('\nFetching all inquiries...');
    const allInquiries = await inquiriesCol.find({}).toArray();
    console.log('Found ' + allInquiries.length + ' inquiries to redistribute.');
    let inquiryUpdated = 0;
    for (const inquiry of allInquiries) {
      const tour = getTourByWeight();
      const isGeneral = Math.random() < 0.08;
      const shouldShiftDate = Math.random() < 0.6;
      const newDate = shouldShiftDate ? naturalRandomDate(startDate, endDate) : inquiry.createdAt;
      const updateFields = {
        tourId: isGeneral ? null : tour.id,
        tourName: isGeneral ? null : tour.name,
        createdAt: newDate,
        updatedAt: newDate,
      };
      await inquiriesCol.updateOne({ _id: inquiry._id }, { $set: updateFields });
      inquiryUpdated++;
      if (inquiryUpdated % 100 === 0) console.log('  Updated ' + inquiryUpdated + '/' + allInquiries.length + ' inquiries...');
    }
    console.log('Redistributed ' + inquiryUpdated + ' inquiries.');

    // --- REDISTRIBUTE BOOKINGS ---
    console.log('\nFetching all bookings...');
    const allBookings = await bookingsCol.find({}).toArray();
    console.log('Found ' + allBookings.length + ' bookings to redistribute.');
    let bookingUpdated = 0;
    for (const booking of allBookings) {
      const shouldShiftDate = Math.random() < 0.55;
      const newDate = shouldShiftDate ? naturalRandomDate(startDate, endDate) : booking.createdAt;
      const travelDate = new Date(newDate.getTime() + (Math.random() * 60 + 15) * 24 * 60 * 60 * 1000);
      await bookingsCol.updateOne({ _id: booking._id }, { $set: { createdAt: newDate, updatedAt: newDate, travelDate: travelDate } });
      bookingUpdated++;
      if (bookingUpdated % 50 === 0) console.log('  Updated ' + bookingUpdated + '/' + allBookings.length + ' bookings...');
    }
    console.log('Redistributed dates for ' + bookingUpdated + ' bookings.');

    // Summary
    console.log('\n--- INQUIRY DISTRIBUTION SUMMARY ---');
    const summary = await inquiriesCol.aggregate([
      { $group: { _id: '$tourName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    for (const s of summary) {
      const label = (s._id || 'General Inquiry').toString().substring(0, 55);
      console.log('  ' + label.padEnd(55) + ' => ' + s.count);
    }
    console.log('\nDone! Refresh your admin panel.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Disconnected.');
  }
}

main().catch(console.error);
