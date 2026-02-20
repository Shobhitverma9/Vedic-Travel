const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const seedMauritius = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const tourSchema = new mongoose.Schema({}, { strict: false });
        const Tour = mongoose.model('Tour', tourSchema);

        const yatraSchema = new mongoose.Schema({}, { strict: false });
        const Yatra = mongoose.model('Yatra', yatraSchema);

        // 1. Create Mauritius Tour
        const tourSlug = 'mauritius-ramayana-trail';
        let tour = await Tour.findOne({ slug: tourSlug });

        if (!tour) {
            console.log('Creating Mauritius Tour...');
            tour = await Tour.create({
                title: 'Mauritius Ramayana Trail',
                slug: tourSlug,
                price: 85000,
                priceOriginal: 105000,
                duration: 7,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1542259681-d218dc60824b?q=80&w=2069&auto=format&fit=crop"], // Placeholder
                packageIncludes: ["Flights", "5 Star Hotel", "All Meals", "Visa"],
                description: "Explore the spiritual connection of Mauritius with our exclusive Ramayana Trail.",
                locations: ["Mauritius", "Grand Bassin"],
                isVedicImprint: true, // Tagging tour as well just in case
            });
        } else {
            console.log('Mauritius Tour already exists.');
        }

        // 2. Create Mauritius Yatra (Category)
        const yatraSlug = 'mauritius-spiritual-journey';
        let yatra = await Yatra.findOne({ slug: yatraSlug });

        if (!yatra) {
            console.log('Creating Mauritius Yatra...');
            yatra = await Yatra.create({
                title: 'Mauritius Spiritual Journey',
                slug: yatraSlug,
                heroImage: "https://images.unsplash.com/photo-1542259681-d218dc60824b?q=80&w=2069&auto=format&fit=crop",
                description: "Discover the divine Ganga Talao and sacred Ramayana sites in Mauritius.",
                longDescription: "<p>Embark on a spiritual journey to the paradise island of Mauritius.</p>",
                isActive: true,
                isVedicImprint: true, // Crucial for appearing in the correct section
                rank: 5,
                packages: [tour._id],
                faqs: []
            });
        } else {
            console.log('Mauritius Yatra already exists.');
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedMauritius();
