const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin';

async function setFavorites() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('vedictravel');
        const tours = db.collection('tours');

        // First reset all favorites
        await tours.updateMany({}, { $set: { isFavorite: false, favoriteSize: 'standard' } });
        console.log('Reset all favorites');

        // Set specific tours as favorites with appropriate sizes
        const favoriteTours = [
            // Large card - UP Golden Triangle
            {
                slug: 'up-golden-triangle-yatra-6d5n',
                favoriteSize: 'large',
                images: [
                    'https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=2070&auto=format&fit=crop', // Varanasi
                    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop', // Ayodhya
                    'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2069&auto=format&fit=crop', // Sarnath
                    'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=2070&auto=format&fit=crop'
                ]
            },
            // Standard cards
            {
                slug: 'kedarnath-badrinath-6d5n',
                favoriteSize: 'standard',
                images: [
                    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop', // Kedarnath
                    'https://images.unsplash.com/photo-1544735716-992bc67a17d2?q=80&w=2070&auto=format&fit=crop'  // Mountain path
                ]
            },
            {
                slug: 'char-dham-helicopter-5d4n',
                favoriteSize: 'standard',
                images: [
                    'https://images.unsplash.com/photo-1582234032488-e99147f1cfd1?q=80&w=2070&auto=format&fit=crop', // Himalayan peak
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'
                ]
            },
            // Wide card
            {
                slug: 'kailash-mansarovar-yatra-standard-package',
                favoriteSize: 'wide',
                images: [
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop', // Mount Kailash type
                    'https://images.unsplash.com/photo-1544735716-992bc67a17d2?q=80&w=2070&auto=format&fit=crop'
                ]
            },
            // Standard cards
            {
                slug: 'ayodhya-darshan-3d2n',
                favoriteSize: 'standard',
                images: [
                    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop', // Ayodhya
                    'https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=2070&auto=format&fit=crop'
                ]
            },
            {
                slug: 'jagannatha-puri-yatra-standard-package',
                favoriteSize: 'standard',
                images: [
                    'https://images.unsplash.com/photo-1626244747206-8c90961b7f9d?q=80&w=2070&auto=format&fit=crop', // Puri
                    'https://images.unsplash.com/photo-1620888204666-ac248ba81239?q=80&w=2070&auto=format&fit=crop'  // Konark
                ]
            },
        ];

        for (const fav of favoriteTours) {
            const result = await tours.updateOne(
                { slug: fav.slug },
                {
                    $set: {
                        isFavorite: true,
                        favoriteSize: fav.favoriteSize,
                        images: fav.images
                    }
                }
            );
            console.log(`Updated ${fav.slug}: ${result.modifiedCount} modified (size: ${fav.favoriteSize})`);
        }

        // Verify
        const favorites = await tours.find({ isFavorite: true }).project({ title: 1, isFavorite: 1, favoriteSize: 1 }).toArray();
        console.log('\nFavorite tours now:', JSON.stringify(favorites, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

setFavorites();
