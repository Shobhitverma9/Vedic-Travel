const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const menuItems = [
    { label: 'Char Dham Yatra', slug: 'char-dham-yatra' },
    { label: 'Kailash Mansarovar Yatra', slug: 'kailash-mansarovar-yatra' },
    { label: 'Adi Kailash – Om Parvat Yatra', slug: 'adi-kailash-om-parvat-yatra' },
    { label: 'KhatuShyam - Salasar - Jaipur', slug: 'khatushyam-salasar-jaipur' },
    { label: 'Varanasi Ayodhya Prayagraj Golden UP Yatra Packages', slug: 'golden-triangle-up' },
    { label: 'Vaishno Devi Yatra', slug: 'vaishno-devi-yatra' },
    { label: 'Shakti Circuit – Himachal Pradesh', slug: 'shakti-circuit-himachal' },
    { label: 'Dwadash Jyotirlinga Packages', slug: 'dwadash-jyotirlinga' },
    { label: 'Tirupati Balaji – Srisailam Yatra Packages', slug: 'tirupati-balaji-srisailam' },
    { label: 'Ahobilam Packages', slug: 'ahobilam' },
    { label: 'Kamakhya Devi Yatra Packages', slug: 'kamakhya-devi-yatra' },
    { label: 'Haridwar & Rishikesh', slug: 'haridwar-rishikesh-wellness' },
    { label: 'Shangarh Tirthan Retreat', slug: 'shangarh-tirthan-retreat' },
    { label: 'Chakrata Retreat', slug: 'chakrata-retreat' },
    { label: 'Kerala Retreat', slug: 'kerala-retreat' },
    { label: 'Royal Rajasthan', slug: 'royal-rajasthan' },
    { label: 'Tales of Tamil Nadu', slug: 'tales-of-tamil-nadu' },
    { label: 'Grandeurs of Gujarat', slug: 'grandeurs-of-gujarat' },
    { label: 'Kingdoms of Karnataka', slug: 'kingdoms-of-karnataka' },
    { label: 'Kedar Kantha Trek', slug: 'kedar-kantha-trek' },
    { label: 'Hampta Pass Trek', slug: 'hampta-pass-trek' },
    { label: 'Valley of Flowers', slug: 'valley-of-flowers' },
    { label: 'Adi Kailash Trek', slug: 'adi-kailash-trek' },
    { label: 'Dayara Bugyal Trek', slug: 'dayara-bugyal-trek' },
    { label: 'Chandrashila Trek', slug: 'chandrashila-trek' },
    { label: 'Shrikhand Mahadev Trek', slug: 'shrikhand-mahadev-trek' },
    { label: 'Rupin Pass Trek', slug: 'rupin-pass-trek' },
    { label: 'Roop Kund Trek', slug: 'roop-kund-trek' },
    { label: 'Angkor Wat Spiritual Journey', slug: 'angkor-wat-spiritual-journey', isVedicImprint: true },
    { label: 'Bali Temple Trail', slug: 'bali-temple-trail', isVedicImprint: true },
    { label: 'Prambanan & Borobudur Expedition', slug: 'prambanan-borobudur-expedition', isVedicImprint: true },
    { label: 'Sri Lanka Ramayana Trail', slug: 'sri-lanka-ramayana-trail', isVedicImprint: true },
    { label: 'Vedic Imprints - International Vedic Tours', slug: 'international-vedic-tours', isVedicImprint: true },
];

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        // Define schemas (simplified for script)
        const tourSchema = new mongoose.Schema({}, { strict: false });
        const Tour = mongoose.model('Tour', tourSchema);

        const yatraSchema = new mongoose.Schema({}, { strict: false });
        const Yatra = mongoose.model('Yatra', yatraSchema);

        console.log('Creating sample Tours for categories...');

        // We will create one generic tour for each yatra if it doesn't have any
        // This ensures the pages are not empty.

        for (const item of menuItems) {
            // Check if Yatra exists
            let yatra = await Yatra.findOne({ slug: item.slug });

            if (!yatra) {
                console.log(`Creating Yatra: ${item.label}...`);

                // Create a sample tour first
                const tourSlug = `${item.slug}-standard-package`;
                let tour = await Tour.findOne({ slug: tourSlug });

                if (!tour) {
                    tour = await Tour.create({
                        title: `${item.label} Standard Package`,
                        slug: tourSlug,
                        price: 15000 + Math.floor(Math.random() * 20000),
                        priceOriginal: 25000 + Math.floor(Math.random() * 10000),
                        duration: 5 + Math.floor(Math.random() * 5),
                        isActive: true,
                        images: ["https://images.unsplash.com/photo-1544735716-992bc67a17d2?q=80&w=2070&auto=format&fit=crop"],
                        packageIncludes: ["Hotel", "Transfer", "Meals"],
                        description: `Experience the divine journey of ${item.label} with our standard package.`,
                        locations: [item.label.split(' ')[0]],
                        itinerary: [
                            { day: 1, title: 'Arrival', description: 'Arrival and transfer to hotel.' },
                            { day: 2, title: 'Darshan', description: 'Early morning darshan and spiritual activities.' }
                        ]
                    });
                }

                yatra = await Yatra.create({
                    title: item.label,
                    slug: item.slug,
                    heroImage: 'https://images.unsplash.com/photo-1544735716-992bc67a17d2?q=80&w=2070&auto=format&fit=crop',
                    description: `Experience the spiritual essence of ${item.label}.`,
                    longDescription: `<p>${item.label} is a sacred journey that offers spiritual rejuvenation and divine experiences. Join us for an unforgettable pilgrimage.</p>`,
                    isActive: true,
                    isVedicImprint: item.isVedicImprint || false,
                    rank: 10,
                    packages: [tour._id],
                    faqs: [
                        { question: 'What is the best time for this journey?', answer: 'The best time varies by season, usually during the pleasant weather months.' }
                    ]
                });
                console.log(`Created Yatra: ${item.label}`);
            } else {
                console.log(`Yatra already exists: ${item.label}`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
};

seedData();
