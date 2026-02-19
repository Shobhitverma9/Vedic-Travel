const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const seedHeroImages = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const settingSchema = new mongoose.Schema({
            key: { type: String, required: true, unique: true },
            value: { type: Object, required: true },
            description: { type: String, required: true }
        }, { timestamps: true });

        const Setting = mongoose.model('Setting', settingSchema);

        const heroImages = [
            '/header-vt.png',
            '/images/cards/chardham.png',
            '/images/cards/varanasi.png',
            '/images/tours/chardham_heli_yatra.png',
            '/images/tours/divine_south_india.png',
            '/images/tours/panch_jyotirlinga.png',
            '/images/tours/up_golden_triangle.png'
        ];

        console.log('Seeding hero_slider_images...');
        await Setting.findOneAndUpdate(
            { key: 'hero_slider_images' },
            {
                key: 'hero_slider_images',
                value: heroImages,
                description: 'List of images for the main home page slider'
            },
            { upsert: true, new: true }
        );

        console.log('Hero images seeded successfully!');
        console.log('Images:', heroImages);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedHeroImages();
