
// Script to seed Yatra data
const fetch = require('node-fetch');

// API Configuration
const PORT = 5000;
const API_PREFIX = 'api/v1';
const BASE_URL = `http://127.0.0.1:${PORT}/${API_PREFIX}`;

async function seedYatras() {
    console.log(`Starting seed against ${BASE_URL}...`);

    // 1. Get some tours to link
    // Assuming GET /tours is available publicly or we might need admin token if protected.
    // Based on controller, likely public for fetching tours.
    try {
        const toursRes = await fetch(`${BASE_URL}/tours`);
        const toursData = await toursRes.json();
        console.log('Tours API Response:', JSON.stringify(toursData, null, 2)); // Debug log
        const tours = toursData.tours || toursData.data || toursData || []; // Try different structures

        if (tours.length === 0) {
            console.error('No tours found to link! Create some tours first.');
            return;
        }

        const tourIds = tours.slice(0, 3).map(t => t._id);

        // 2. Create "Kailash Mansarovar Yatra"
        const kailashYatra = {
            title: "Kailash Mansarovar Yatra 2026 Packages",
            description: "Come with us on a spectacular journey to Kailash, a very sacred place of Hindu origins. Get a chance to explore the stunning views of Kailash Parvat and Mansarovar Jheel, referred to as the holy abode of Lord Shiva.",
            isActive: true,
            rank: 1,
            packages: tourIds
        };

        // 3. Create "Chardham Yatra"
        const chardhamYatra = {
            title: "Chardham Yatra in Uttarakhand",
            description: "The Chardham Yatra is considered one of the most sacred yatra according to Vedic scriptures belonging to Sanatan Dharma. Trip to Temples is calling you to explore the four important places of the Char Dham Yatra in Uttarakhand: Yamunotri, Gangotri, Kedarnath, and Badrinath.",
            isActive: true,
            rank: 2,
            packages: tourIds
        };

        console.log('Creating Yatras...');

        const res1 = await fetch(`${BASE_URL}/yatras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kailashYatra)
        });
        const d1 = await res1.json();
        console.log('Created Kailash Yatra:', d1._id || d1);

        const res2 = await fetch(`${BASE_URL}/yatras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chardhamYatra)
        });
        const d2 = await res2.json();
        console.log('Created Chardham Yatra:', d2._id || d2);

    } catch (e) {
        console.error('Error seeding:', e);
    }

    console.log('Done!');
}

seedYatras();
