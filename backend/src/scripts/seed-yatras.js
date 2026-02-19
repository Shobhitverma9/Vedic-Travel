const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        // Define schemas
        const tourSchema = new mongoose.Schema({}, { strict: false });
        const Tour = mongoose.model('Tour', tourSchema);

        const yatraSchema = new mongoose.Schema({}, { strict: false });
        const Yatra = mongoose.model('Yatra', yatraSchema);

        console.log('Clearing existing data...');
        await Yatra.deleteMany({});
        await Tour.deleteMany({});

        console.log('Creating sample Tours...');
        const toursData = [
            {
                title: "Premium Char Dham Yatra by Helicopter",
                slug: "char-dham-helicopter-5d4n",
                price: 185000,
                priceOriginal: 210000,
                duration: 5,
                badge: "Elite",
                emiStartingFrom: 7999,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1544735716-992bc67a17d2?q=80&w=2070&auto=format&fit=crop"],
                packageIncludes: ["Hotel", "Transfer", "Meals", "Sightseeing"],
                isTrending: true
            },
            {
                title: "Classic Kedarnath & Badrinath",
                slug: "kedarnath-badrinath-6d5n",
                price: 24500,
                priceOriginal: 30000,
                duration: 6,
                badge: "Best Seller",
                emiStartingFrom: 1250,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop"],
                packageIncludes: ["Hotel", "Transfer", "Meals"],
                isTrending: true
            },
            {
                title: "Ganga Sangam: Prayagraj & Kashi",
                slug: "prayagraj-kashi-spiritual",
                price: 15999,
                priceOriginal: 22000,
                duration: 4,
                badge: "Popular",
                emiStartingFrom: 899,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=2070&auto=format&fit=crop"],
                packageIncludes: ["Hotel", "Sightseeing", "Meals"],
                isTrending: false
            },
            {
                title: "Ayodhya Ram Mandir Special",
                slug: "ayodhya-darshan-3d2n",
                price: 9999,
                priceOriginal: 15000,
                duration: 3,
                badge: "New Launch",
                emiStartingFrom: 499,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop"],
                packageIncludes: ["Hotel", "Transfer", "Meals"],
                isTrending: true
            },
            {
                title: "Mt. Kailash Overland Journey",
                slug: "kailash-overland-14d",
                price: 225000,
                priceOriginal: 250000,
                duration: 14,
                badge: "Advanture",
                emiStartingFrom: 9999,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"],
                packageIncludes: ["Hotel", "Transfer", "Meals", "Visa"],
                isTrending: false
            }
        ];

        const insertedTours = await Tour.insertMany(toursData);
        console.log(`Created ${insertedTours.length} tours.`);

        console.log('Creating Yatras and linking packages...');
        const yatras = [
            {
                title: 'Char Dham Yatra',
                slug: 'char-dham-yatra',
                heroImage: 'https://images.unsplash.com/photo-1544735716-992bc67a17d2?q=80&w=2070&auto=format&fit=crop',
                description: 'Divine journey to the four sacred abodes of Uttarakhand.',
                longDescription: '<p>The Char Dham Yatra is one of the most popular spiritual journeys in India. It consists of four sacred sites: Yamunotri, Gangotri, Kedarnath, and Badrinath.</p>',
                isActive: true,
                rank: 1,
                packages: [insertedTours[0]._id, insertedTours[1]._id],
                faqs: [
                    { question: 'What is the best time for Char Dham?', answer: 'May-June and Sept-Oct.' }
                ]
            },
            {
                title: 'Kailash Mansarovar',
                slug: 'kailash-mansarovar',
                heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
                description: 'The ultimate pilgrimage to the abode of Lord Shiva.',
                longDescription: '<p>Mount Kailash is considered the center of the universe. For Hindus, it is the heavenly abode of Lord Shiva.</p>',
                isActive: true,
                rank: 2,
                packages: [insertedTours[4]._id],
                faqs: [
                    { question: 'Do I need a passport?', answer: 'Yes, as it is in Tibet.' }
                ]
            },
            {
                title: 'UP Golden Triangle',
                slug: 'up-golden-triangle',
                heroImage: 'https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=2070&auto=format&fit=crop',
                description: 'Kashi, Prayagraj, and Ayodhya.',
                longDescription: '<p>Experience the divine energy of Uttar Pradesh. Varanasi, Prayagraj and Ayodhya.</p>',
                isActive: true,
                rank: 3,
                packages: [insertedTours[2]._id, insertedTours[3]._id],
                faqs: [
                    { question: 'Is Ram Mandir open?', answer: 'Yes, it is open for Darshan.' }
                ]
            }
        ];

        await Yatra.insertMany(yatras);
        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
};

seedData();
