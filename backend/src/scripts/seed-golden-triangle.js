const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const seedTour = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const tourSchema = new mongoose.Schema({
            packageType: { type: String, default: 'Land Only' }
        }, { strict: false, timestamps: true });
        const Tour = mongoose.model('Tour', tourSchema);

        const tourData = {
            title: "Divya UP Golden Triangle Yatra (Varanasi - Ayodhya - Prayagraj)",
            slug: "up-golden-triangle-yatra-6d5n",
            description: "Embark on a divine journey through the spiritual heart of Uttar Pradesh. Visit Varanasi, Prayagraj, and Ayodhya.",
            price: 24999,
            priceOriginal: 32000,
            duration: 6,
            maxGroupSize: 15,
            packageType: "Land Only",
            category: "pilgrimage",
            isActive: true,
            isTrending: true,
            trendingRank: 1,
            locations: ["Varanasi", "Prayagraj", "Ayodhya"],
            packageIncludes: ["Hotel", "Sightseeing", "Transfer", "Meals", "Guide"],
            slideshowImages: [
                "https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=2070&auto=format&fit=crop", // Varanasi Ghats
                "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop", // Taj Mahal
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2069&auto=format&fit=crop", // Varanasi boats
                "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop", // Ganges Aarti
                "https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=2070&auto=format&fit=crop"  // Temple architecture
            ],
            placesHighlights: [
                { image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?q=80&w=200&auto=format&fit=crop", title: "Kashi Vishwanath" },
                { image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=200&auto=format&fit=crop", title: "Ganga Aarti" },
                { image: "https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=200&auto=format&fit=crop", title: "Dashashwamedh" },
                { image: "https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=200&auto=format&fit=crop", title: "Ayodhya Ram Mandir" }
            ],
            images: [
                "https://images.unsplash.com/photo-1561361513-6446294a292d?q=80&w=2070&auto=format&fit=crop", // Varanasi Ghats
                "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop", // Taj Mahal
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=2069&auto=format&fit=crop", // Varanasi boats
                "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop", // Ganges Aarti
                "https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=2070&auto=format&fit=crop"  // Temple architecture
            ],
            hotels: [
                { name: "Hotel Meraden Grand", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", description: "Luxury stay in Varanasi near the Ghats", rating: 4 },
                { name: "Ramayana Hotel", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop", description: "Comfortable stay in Ayodhya", rating: 3 }
            ],
            itinerary: [
                { day: 1, title: "Arrival in Kashi", description: "Begin journey", items: [{ type: "transfer", title: "Pickup", description: "Airport pickup" }, { type: "activity", title: "Ganga Aarti", description: "Evening Aarti" }] },
                { day: 2, title: "Kashi Vishwanath", description: "Temple visit", items: [{ type: "activity", title: "Darshan", description: "Main temple visit" }, { type: "activity", title: "Sarnath", description: "Buddhist site excursion" }] },
                { day: 3, title: "Prayagraj", description: "Move to Prayagraj", items: [{ type: "transfer", title: "Drive", description: "To Prayagraj" }, { type: "activity", title: "Sangam", description: "Holy dip" }] },
                { day: 4, title: "Ayodhya", description: "Move to Ayodhya", items: [{ type: "transfer", title: "Drive", description: "To Ayodhya" }, { type: "activity", title: "Ram Mandir", description: "Darshan" }] },
                { day: 5, title: "Sightseeing", description: "Ayodhya local", items: [{ type: "activity", title: "Hanuman Garhi", description: "Temple visit" }] },
                { day: 6, title: "Departure", description: "End tour", items: [{ type: "transfer", title: "Drop", description: "To Airport" }] }
            ],
            inclusions: ["Accommodation", "Breakfast", "Transport"],
            exclusions: ["Flights", "Lunch"],
            dos: ["Dress modestly"],
            donts: ["No photography inside"],
            thingsToCarry: ["Traditional Clothes"]
        };

        const existingFilter = { slug: tourData.slug };
        const update = { $set: tourData };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const result = await Tour.findOneAndUpdate(existingFilter, update, options);
        console.log('Tour seeded successfully:', result.title);
        console.log('Package Type:', result.packageType);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedTour();
