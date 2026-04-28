export const destinationsData: Record<string, {
    title: string;
    heroImage: string;
    thumbnailImages?: string[];
    description: string;
    faqs: { question: string; answer: string }[];
}> = {
    'north-india': {
        title: 'North India',
        heroImage: '/images/tours/chardham_heli_yatra.png', // Placeholder, using existing image
        thumbnailImages: ['/images/tours/chardham_heli_yatra.png', '/images/tours/kedar-kantha.jpg'],
        description: `
            <p>Welcome to <strong>North India</strong>, a land of majestic mountains, spiritual awakenings, and vibrant culture. From the snow-capped peaks of the Himalayas to the holy banks of the Ganges, North India offers a journey like no other.</p>
            <h3>Spiritual Significance</h3>
            <p>Home to the sacred Char Dham Yatra, the holy cities of Varanasi, Ayodhya, and Mathura, North India is the spiritual heart of the country.</p>
            <h3>Popular Destinations</h3>
            <ul>
                <li><strong>Uttarakhand:</strong> The land of gods (Devbhoomi), offering Char Dham, Rishikesh, and Haridwar.</li>
                <li><strong>Himachal Pradesh:</strong> Scenic hill stations and ancient temples.</li>
                <li><strong>Uttar Pradesh:</strong> The spiritual capital with Varanasi, Ayodhya, and Prayagraj.</li>
                <li><strong>Jammu & Kashmir:</strong> Vaishno Devi and Amarnath Yatra.</li>
            </ul>
        `,
        faqs: [
            {
                question: 'What is the best time to visit North India?',
                answer: 'The best time depends on the destination. For Himalayas (Char Dham), May to June and September to October are ideal. For plains (Varanasi/Ayodhya), October to March is pleasant.',
            },
            {
                question: 'Are these tours suitable for senior citizens?',
                answer: 'Yes, we offer customized packages with helicopter options and comfortable transport for senior citizens.',
            },
        ],
    },
    'south-india': {
        title: 'South India',
        heroImage: '/images/tours/divine_south_india.png', // Placeholder
        thumbnailImages: ['/images/tours/divine_south_india.png', '/images/tours/tirupati.jpg'],
        description: `
            <p>Experience the divine charm of <strong>South India</strong>, known for its magnificent temples, rich heritage, and serene landscapes. Explore the architectural marvels of Dravidian style temples and the lush greenery of the Western Ghats.</p>
            <h3>Temple Architecture</h3>
            <p>Witness the towering gopurams of Tamil Nadu, the intricate carvings of Karnataka, and the spiritual aura of Tirupati and Rameshwaram.</p>
            <h3>Key Pilgrimages</h3>
            <ul>
                <li><strong>Tamil Nadu:</strong> Rameshwaram, Madurai Meenakshi, Kanyakumari.</li>
                <li><strong>Andhra Pradesh:</strong> Tirupati Balaji, Srisailam Mallikarjuna (Jyotirlinga).</li>
                <li><strong>Kerala:</strong> Padmanabhaswamy Temple, Guruvayur.</li>
            </ul>
        `,
        faqs: [
            {
                question: 'How many days are required for a South India temple tour?',
                answer: 'A comprehensive tour can take 10-15 days, but short packages of 4-5 days for specific circuits (like Rameshwaram-Madurai) are also available.',
            },
            {
                question: 'Is food an issue for vegetarians?',
                answer: 'Absolutely not. South India is a haven for vegetarians with plenty of pure veg dining options available everywhere.',
            },
        ],
    },
    'east-india': {
        title: 'East India',
        heroImage: '/images/tours/kamakhya-devi.jpg', // Placeholder
        thumbnailImages: ['/images/tours/kamakhya-devi.jpg', '/images/tours/jagannath-puri.jpg'],
        description: `
            <p><strong>East India</strong> invites you to explore its mystical temples, tea gardens, and the abode of Goddess Shakti. It is a region of deep spiritual significance and natural beauty.</p>
            <h3>Shakti Peethas</h3>
            <p>East India is famous for Kamakhya Devi in Assam and Kalighat in Kolkata, significant Shakti Peethas in Hinduism.</p>
            <h3>Highlights</h3>
            <ul>
                <li><strong>Odisha:</strong> Jagannath Puri (Char Dham), Konark Sun Temple.</li>
                <li><strong>Assam:</strong> Kamakhya Devi Temple.</li>
                <li><strong>West Bengal:</strong> Gangasagar, Kalighat.</li>
            </ul>
        `,
        faqs: [
            {
                question: 'When is the Ambubachi Mela at Kamakhya Devi?',
                answer: 'It is usually held in June. It is a major festival celebrating the menstruation of the Goddess.',
            },
        ],
    },
    'west-india': {
        title: 'West India',
        heroImage: '/images/tours/dwarka-somnath.jpg', // Placeholder
        thumbnailImages: ['/images/tours/dwarka-somnath.jpg', '/images/tours/khatu-shyam.jpg'],
        description: `
            <p><strong>West India</strong> offers a blend of devotion and desert. From the holy Dwarkadhish temple to the first Jyotirlinga at Somnath, it is a land of vibrant devotion.</p>
            <h3>Sacred Sites</h3>
            <ul>
                <li><strong>Gujarat:</strong> Dwarka (Char Dham), Somnath (Jyotirlinga), Nageshwar.</li>
                <li><strong>Maharashtra:</strong> Shirdi Sai Baba, Tryambakeshwar, Bhimashankar.</li>
                <li><strong>Rajasthan:</strong> Khatu Shyam Ji, Salasar Balaji, Brahma Temple (Pushkar).</li>
            </ul>
        `,
        faqs: [
            {
                question: 'How to reach Dwarka and Somnath?',
                answer: 'Ahmedabad is the nearest major airport/railway hub. We provide comfortable transfers from Ahmedabad to Dwarka and Somnath.',
            },
        ],
    },
    'central-india': {
        title: 'Central India',
        heroImage: '/images/tours/mahakaleshwar.jpg', // Placeholder
        thumbnailImages: ['/images/tours/mahakaleshwar.jpg', '/images/tours/omkareshwar.jpg'],
        description: `
            <p>The heart of Incredible India, <strong>Central India</strong> is known for its two powerful Jyotirlingas in Ujjain and Omkareshwar.</p>
            <h3>Mahakaleshwar</h3>
            <p>Visit the Mahakaleshwar temple in Ujjain, the only south-facing Jyotirlinga, famous for its Bhasma Aarti.</p>
            <h3>Destinations</h3>
            <ul>
                <li><strong>Madhya Pradesh:</strong> Ujjain, Omkareshwar, Amarkantak.</li>
            </ul>
        `,
        faqs: [
            {
                question: 'How to book Bhasma Aarti tickets?',
                answer: 'Bhasma Aarti booking needs to be done online in advance. We guide our guests on the process or assist where possible.',
            },
        ],
    },
    'international': {
        title: 'International Vedic Tours',
        heroImage: '/images/tours/kailash-mansarovar.jpg', // Placeholder
        thumbnailImages: ['/images/tours/kailash-mansarovar.jpg', '/images/tours/angkor-wat.jpg'],
        description: `
            <p>Embark on spiritual journeys beyond borders. Our <strong>International</strong> packages cover renowned pilgrimages like Kailash Mansarovar and temples in neighboring countries.</p>
            <h3>Kailash Mansarovar</h3>
            <p>The ultimate pilgrimage to the abode of Lord Shiva in Tibet.</p>
            <h3>Other Tours</h3>
            <ul>
                <li><strong>Nepal:</strong> Pashupatinath, Muktinath.</li>
                <li><strong>Sri Lanka:</strong> Ramayana Trail.</li>
            </ul>
        `,
        faqs: [
            {
                question: 'Do we need a passport?',
                answer: 'Yes, a valid passport is mandatory for all international tours including Nepal (for flight travel) and Kailash Mansarovar.',
            },
        ],
    },
};
