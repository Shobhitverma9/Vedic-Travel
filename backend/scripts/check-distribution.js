const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db('vedictravel');
    
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ];

    console.log("--- INQUIRIES PER MONTH ---");
    const inquiries = await db.collection('inquiries').aggregate(pipeline).toArray();
    for(const m of inquiries) {
      console.log(`${m._id.year}-${m._id.month.toString().padStart(2, '0')}: ${m.count}`);
    }
    
    console.log("\n--- BOOKINGS PER MONTH ---");
    const bookings = await db.collection('bookings').aggregate(pipeline).toArray();
    for(const m of bookings) {
      console.log(`${m._id.year}-${m._id.month.toString().padStart(2, '0')}: ${m.count}`);
    }
    
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
