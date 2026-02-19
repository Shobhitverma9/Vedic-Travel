const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const sampleTours = [
    {
        title: 'Kailash Mansarovar Aerial Darshan 2026',
        slug: 'kailash-mansarovar-aerial-darshan',
        description: 'Special hawan pujan, Lucknow-Nepalgunj by car, 4 star hotel stay.',
        price: 36000,
        duration: 3, // 2 Night / 3 Days
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop'],
        locations: ['Lucknow', 'Nepalgunj'],
        isTrending: true,
        trendingRank: 1,
        highlights: { temples: ['Special hawan pujan', 'Pashupatinath'] }
    },
    {
        title: 'Kailash Mansarovar Yatra 2026 by Helicopter',
        slug: 'kailash-mansarovar-helicopter',
        description: 'Pandit ji at Mansarovar Lake, Portable toilets at Mansarovar Lake, Complimentary stay at Lucknow.',
        price: 180000,
        duration: 11, // 10 Night / 11 Days
        images: ['https://images.unsplash.com/photo-1626014902345-568eb211afde?q=80&w=1000&auto=format&fit=crop'],
        locations: ['Zuthulpuk', 'Purang'],
        isTrending: true,
        trendingRank: 2,
        highlights: { temples: ['Pandit ji at Mansarovar Lake'] }
    },
    {
        title: 'Char Dham Yatra by Helicopter',
        slug: 'char-dham-helicopter',
        description: 'Helicopter ride for Char Dham, Palki/pony at Yamunotri, Kedarnath shuttles.',
        price: 150000,
        duration: 6, // 5 Night / 6 Days
        images: ['https://images.unsplash.com/photo-1605649476116-729ce97ae17c?q=80&w=1000&auto=format&fit=crop'],
        locations: ['Dehradun', 'Yamunotri'],
        isTrending: true,
        trendingRank: 3,
        highlights: { temples: ['Helicopter ride'] }
    },
    {
        title: 'Overland Kailash Mansarovar Yatra 2026',
        slug: 'overland-kailash-mansarovar',
        description: 'No extra charge for delays, Darchen stay, Panchang-based date.',
        price: 140000,
        duration: 14, // 13 Night / 14 Days
        images: ['https://images.unsplash.com/photo-1596024985223-956df423dc30?q=80&w=1000&auto=format&fit=crop'],
        locations: ['Kathmandu', 'Dhunche'],
        isTrending: true,
        trendingRank: 4,
        highlights: { temples: ['Panchang-based date'] }
    }
];

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const tourSchema = new mongoose.Schema({}, { strict: false });
        const Tour = mongoose.model('Tour', tourSchema);

        const count = await Tour.countDocuments();
        if (count === 0) {
            console.log('No tours found. Inserting sample data...');
            await Tour.insertMany(sampleTours.map(t => ({
                ...t,
                maxGroupSize: 20,
                category: 'pilgrimage',
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            })));
            console.log('Inserted 4 tours.');
        } else {
            console.log(`Found ${count} tours. Updating first 4 to be trending...`);
            const tours = await Tour.find().limit(4);
            for (let i = 0; i < tours.length; i++) {
                await Tour.updateOne({ _id: tours[i]._id }, {
                    $set: { isTrending: true, trendingRank: i + 1 }
                });
            }
            console.log('Updated existing tours.');
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seed();
