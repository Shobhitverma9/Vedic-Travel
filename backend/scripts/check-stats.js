const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db('vedictravel');
    
    const bookings = await db.collection('bookings').countDocuments();
    const inquiries = await db.collection('inquiries').countDocuments();
    
    console.log(`Bookings: ${bookings}`);
    console.log(`Inquiries: ${inquiries}`);
    console.log(`Conversion Rate: ${((bookings / inquiries) * 100).toFixed(2)}%`);
    
    const targetInquiries = Math.round(bookings / 0.045);
    const targetBookings = Math.round(inquiries * 0.045);
    
    console.log(`To get 4.5% conversion:`);
    console.log(` - Keep bookings, add ${targetInquiries - inquiries} inquiries`);
    console.log(` - Keep inquiries, remove ${bookings - targetBookings} bookings`);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
