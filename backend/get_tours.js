const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('vedictravel');
    const toursCollection = database.collection('tours'); // Assuming collection is named 'tours'

    const yatras = await toursCollection.find({ category: 'yatra' }).toArray();
    const packages = await toursCollection.find({ category: 'package' }).toArray();
    const all = await toursCollection.find({}).project({ title: 1, slug: 1, category: 1 }).toArray();

    console.log("All Tours:", all);
  } finally {
    await client.close();
  }
}

main().catch(console.dir);
