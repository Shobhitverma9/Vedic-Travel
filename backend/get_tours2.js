const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('vedictravel');
    const toursCollection = database.collection('tours');

    const yatras = await toursCollection.find({ type: 'yatra' }).limit(3).project({ title: 1, slug: 1, type: 1, category: 1 }).toArray();
    const packages = await toursCollection.find({ type: 'package' }).limit(3).project({ title: 1, slug: 1, type: 1, category: 1 }).toArray();
    
    // Also try checking category if type isn't used
    const yatrasCat = await toursCollection.find({ category: 'yatra' }).limit(3).project({ title: 1, slug: 1, type: 1, category: 1 }).toArray();
    const packagesCat = await toursCollection.find({ category: 'package' }).limit(3).project({ title: 1, slug: 1, type: 1, category: 1 }).toArray();

    console.log("Yatras (by type):", yatras);
    console.log("Packages (by type):", packages);
    console.log("Yatras (by category):", yatrasCat);
    console.log("Packages (by category):", packagesCat);

  } finally {
    await client.close();
  }
}

main().catch(console.dir);
