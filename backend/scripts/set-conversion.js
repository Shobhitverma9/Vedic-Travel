const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('vedictravel');
    
    const bookingsCol = db.collection('bookings');
    const inquiriesCol = db.collection('inquiries');
    
    const numBookings = await bookingsCol.countDocuments();
    const numInquiries = await inquiriesCol.countDocuments();
    
    console.log(`Current Bookings: ${numBookings}`);
    console.log(`Current Inquiries: ${numInquiries}`);
    
    const TARGET_RATE = 0.045;
    let currentRate = numBookings / numInquiries;
    console.log(`Current Conversion Rate: ${(currentRate * 100).toFixed(2)}%`);
    
    if (currentRate > TARGET_RATE) {
      // Need to delete bookings to reduce conversion rate
      const targetBookings = Math.round(numInquiries * TARGET_RATE);
      const bookingsToDelete = numBookings - targetBookings;
      
      console.log(`Deleting ${bookingsToDelete} bookings to reach 4.5% conversion rate...`);
      
      const excessBookings = await bookingsCol.find({}).limit(bookingsToDelete).toArray();
      const excessBookingIds = excessBookings.map(b => b._id);
      
      if (excessBookingIds.length > 0) {
        await bookingsCol.deleteMany({ _id: { $in: excessBookingIds } });
        console.log(`Successfully deleted ${bookingsToDelete} bookings.`);
      }
    } else {
      // Need to delete inquiries to increase conversion rate
      const targetInquiries = Math.round(numBookings / TARGET_RATE);
      const inquiriesToDelete = numInquiries - targetInquiries;
      
      console.log(`Deleting ${inquiriesToDelete} inquiries to reach 4.5% conversion rate...`);
      
      const excessInquiries = await inquiriesCol.find({}).limit(inquiriesToDelete).toArray();
      const excessInquiryIds = excessInquiries.map(i => i._id);
      
      if (excessInquiryIds.length > 0) {
        await inquiriesCol.deleteMany({ _id: { $in: excessInquiryIds } });
        console.log(`Successfully deleted ${inquiriesToDelete} inquiries.`);
      }
    }
    
    const finalBookings = await bookingsCol.countDocuments();
    const finalInquiries = await inquiriesCol.countDocuments();
    console.log(`New Conversion Rate: ${((finalBookings / finalInquiries) * 100).toFixed(2)}%`);
    
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
