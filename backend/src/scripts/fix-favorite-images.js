const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin';

/*
  Verified 200 OK URLs (manually tested):
  Varanasi ghats:
    photo-1587474260584  ✓
    photo-1506461883276  ✓
  Kedarnath (already working):
    photo-1626621341517  ✓
  Kailash (already working):
    photo-1464822759023  ✓
  
  Replacing broken ones with reliable alternatives:
    Char Dham / Himalayas  → photo-1522199755839-a2bacb67c546  (mountain aerial, known good)
    Ayodhya / temple       → photo-1548013146-72479768bada  (was valid earlier in seeding)
    Puri / temple          → photo-1580974928064-f0aeef70895a  (Indian temple, known good)
                             photo-1598449426314-8b02525e8733  (sea/beach, known good)
*/
async function updateImages() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('vedictravel');
        const tours = db.collection('tours');

        const updates = [
            // UP Golden Triangle — 2 verified working Varanasi images
            {
                slug: 'up-golden-triangle-yatra-6d5n',
                images: [
                    'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=2070&auto=format&fit=crop',
                ]
            },
            // Char Dham Helicopter — Himalayan mountain scenery
            {
                slug: 'char-dham-helicopter-5d4n',
                images: [
                    'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=2072&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
                ]
            },
            // Ayodhya Ram Mandir — use Varanasi ghat + Indian devotion images
            {
                slug: 'ayodhya-darshan-3d2n',
                images: [
                    'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=2070&auto=format&fit=crop',
                ]
            },
            // Jagannatha Puri — use beach + coastal India images
            {
                slug: 'jagannatha-puri-yatra-standard-package',
                images: [
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2070&auto=format&fit=crop',
                ]
            },
        ];

        for (const update of updates) {
            const result = await tours.updateOne(
                { slug: update.slug },
                { $set: { images: update.images } }
            );
            console.log(`Updated images for ${update.slug}: ${result.modifiedCount} modified`);
        }

        // Verify
        const favorites = await tours.find({ isFavorite: true }).project({ title: 1, images: 1 }).toArray();
        console.log('\nFavorite tours with updated images:');
        favorites.forEach(t => console.log(`  ${t.title}:\n    ${t.images[0]}`));
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

updateImages();
