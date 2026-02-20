const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const seedJagannatha = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const tourSchema = new mongoose.Schema({}, { strict: false });
        const Tour = mongoose.model('Tour', tourSchema);

        const yatraSchema = new mongoose.Schema({}, { strict: false });
        const Yatra = mongoose.model('Yatra', yatraSchema);

        // 1. Create Jagannatha Tour
        const tourSlug = 'jagannatha-puri-yatra-standard-package';
        let tour = await Tour.findOne({ slug: tourSlug });

        if (!tour) {
            console.log('Creating Jagannatha Puri Tour...');
            tour = await Tour.create({
                title: 'Jagannatha Puri Yatra Standard Package',
                slug: tourSlug,
                price: 18500,
                priceOriginal: 24000,
                duration: 4,
                isActive: true,
                images: ["https://images.unsplash.com/photo-1626244747206-8c90961b7f9d?q=80&w=2070&auto=format&fit=crop"], // Placeholder for Puri Temple
                packageIncludes: ["Hotel", "Breakfast", "Darshan Ticket", "Transfers"],
                description: "Experience the divine Rath Yatra and sacred darshan at Jagannatha Puri.",
                locations: ["Puri", "Konark"],
                isVedicImprint: false,
            });
        } else {
            console.log('Jagannatha Puri Tour already exists.');
        }

        // 2. Create Jagannatha Yatra (Category)
        const yatraSlug = 'jagannatha-puri-yatra';
        let yatra = await Yatra.findOne({ slug: yatraSlug });

        if (!yatra) {
            console.log('Creating Jagannatha Puri Yatra...');
            yatra = await Yatra.create({
                title: 'Jagannatha Puri Yatra',
                slug: yatraSlug,
                heroImage: "https://images.unsplash.com/photo-1626244747206-8c90961b7f9d?q=80&w=2070&auto=format&fit=crop",
                description: "A sacred pilgrimage to one of the Char Dhams in Eastern India.",
                longDescription: "<p>Jagannatha Puri is a major Hindu pilgrimage site and one of the Char Dham pilgrimage sites.</p>",
                isActive: true,
                isVedicImprint: false,
                rank: 8,
                packages: [tour._id],
                faqs: []
            });
        } else {
            console.log('Jagannatha Puri Yatra already exists.');
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedJagannatha();
