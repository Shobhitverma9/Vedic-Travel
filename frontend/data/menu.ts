export interface MenuItem {
    label: string;
    href?: string;
    children?: MenuItem[];
    mobileOnly?: boolean;
}

export const menuItems: MenuItem[] = [
    {
        label: 'Home',
        href: '/',
        mobileOnly: true,
    },
    {
        label: 'Tours & Packages',
        children: [
            {
                label: 'Trending Packages',
                children: [
                    { label: 'Char Dham Yatra Package', href: '/tours/char-dham-yatra' },
                    { label: 'Kailash Mansarovar Yatra Package', href: '/tours/kailash-mansarovar-yatra' },
                    { label: 'Adi Kailash – Om Parvat Yatra Package', href: '/tours/adi-kailash-om-parvat-yatra' },
                    { label: 'KhatuShyam - Salasar - Jaipur Yatra Package', href: '/tours/khatushyam-salasar-jaipur' },
                    { label: 'Varanasi, Ayodhya & Prayagraj Golden Triangle Yatra Package', href: '/package/up-golden-triangle-yatra-6d5n' },
                    { label: 'Vaishno Devi Yatra Package', href: '/tours/vaishno-devi-yatra' },
                    { label: 'Shakti Circuit – Himachal Pradesh Yatra Package', href: '/tours/shakti-circuit-himachal' },
                ],
            },
            {
                label: 'Pilgrimage Yatra Packages',
                children: [
                    { label: 'Char Dham Yatra Packages', href: '/tours/char-dham-yatra' },
                    { label: 'Varanasi, Ayodhya & Prayagraj Golden Triangle Yatra Package', href: '/package/up-golden-triangle-yatra-6d5n' },
                    { label: 'Dwadash Jyotirlinga Packages', href: '/tours/dwadash-jyotirlinga' },
                    { label: 'Vaishno Devi Yatra Packages', href: '/tours/vaishno-devi-yatra' },
                    { label: 'Tirupati Balaji – Srisailam Yatra Packages', href: '/tours/tirupati-balaji-srisailam' },
                    { label: 'Ahobilam Packages', href: '/tours/ahobilam' },
                    { label: 'Kamakhya Devi Yatra Packages', href: '/tours/kamakhya-devi-yatra' },
                    { label: 'Jagannatha Puri Yatra Packages', href: '/tours/jagannatha-puri-yatra' },
                ],
            },
            {
                label: 'Yoga & Wellness Retreats',
                children: [
                    { label: 'Haridwar/Rishikesh- Sacred Yoga Sanctuary Retreat', href: '/tours/haridwar-rishikesh-wellness' },
                    { label: 'Kerala - Ayurvedic Healing Coast Retreat', href: '/tours/kerala-retreat' },
                    { label: 'Shangarh - Himalayan Nature & Healing Retreats', href: '/tours/shangarh-tirthan-retreat' },
                    { label: 'Western Ghats- Mulsi/Sahyadri Wellness & Renewal Estate', href: '/tours/western-ghats-wellness' },
                ],
            },
            {
                label: 'Heritage and Cultural Tours',
                children: [
                    {
                        label: 'Royal Rajasthan Cultural Odyssey',
                        children: [
                            { label: 'Udaipur Palace & Lake Heritage Escape', href: '/tours/udaipur-heritage' },
                            { label: 'Royal Journey Rajasthan', href: '/tours/royal-journey-rajasthan' },
                        ]
                    },
                    {
                        label: 'Magnificent Maharashtra',
                        children: [
                            { label: 'Ellora & Ajanta- Ancient Rock Heritage Sanctuaries', href: '/tours/ellora-ajanta' },
                        ]
                    },
                    {
                        label: 'Kingly Karnataka',
                        children: [
                            { label: 'Hampi Imperial Ruins Expedition', href: '/tours/hampi-expedition' },
                            { label: 'Mysore Regal Heritage Journey', href: '/tours/mysore-heritage' },
                        ]
                    },
                    {
                        label: 'Majestic Madhya Pradesh',
                        children: [
                            { label: 'Khajuraho Temple Artistry Retreat', href: '/tours/khajuraho-artistry' },
                            { label: 'Sanchi Stupa Retreat', href: '/tours/sanchi-retreat' },
                        ]
                    },
                    {
                        label: 'Uplifting Uttar Pradesh',
                        children: [
                            { label: 'Banaras Cultural & Heritage Immersion', href: '/tours/banaras-immersion' },
                        ]
                    },
                    {
                        label: 'Grandeurs of Gujarat',
                        children: [
                            { label: 'Rann of Kutch – Cultural Desert Landscape', href: '/tours/rann-of-kutch' },
                            { label: 'In The Lap of Sabarmati', href: '/tours/in-the-lap-of-sabarmati' },
                            { label: 'Statue of Unity – India’s Modern Heritage Icon', href: '/tours/statue-of-unity' },
                        ]
                    },
                ],
            },
            {
                label: 'Adventure & Eco Tours',
                children: [
                    { label: 'Ladakh – High-Altitude Luxury Adventure', href: '/tours/ladakh-adventure' },
                    { label: 'Spiti Valley – Remote Himalayan Eco Wilderness', href: '/tours/spiti-valley' },
                    { label: 'Andaman and Nicobar Islands – Marine Eco Adventure', href: '/tours/andaman-eco' },
                    { label: 'Jim Corbett National Park – Luxury Wildlife & Eco Safaris', href: '/tours/jim-corbett-safari' },
                    { label: 'Kaziranga National Park – Exclusive Wildlife Expeditions', href: '/tours/kaziranga-expedition' },
                    { label: 'Chadar Trek – The Frozen River Expedition', href: '/tours/chadar-trek' },
                    { label: 'Valley of Flowers National Park Trek – Scenic UNESCO Trail', href: '/tours/valley-of-flowers' },
                    { label: 'Hampta Pass Trek – Dramatic Landscape Transitions', href: '/tours/hampta-pass-trek' },
                    { label: 'Kedar Kantha Trek – Premium Winter Trekking Experience', href: '/tours/kedar-kantha-trek' },
                    { label: 'Chandrashila Trek- Himalayan Sunrise Summit', href: '/tours/chandrashila-trek' },
                    { label: 'Roop Kund Trek- Mystical Lake Expedition', href: '/tours/roop-kund-trek' },
                    { label: 'Dayara Bugyal Trek- Alpine Meadow Escape', href: '/tours/dayara-bugyal-trek' },
                ],
            },
            {
                label: 'Vedic Imprints (International)',
                children: [
                    { label: 'Sacred Ramayana Trails of Sri Lanka', href: '/tours/sri-lanka-ramayana' },
                    { label: 'Nepal – Himalayan Spiritual Realm', href: '/tours/nepal-spiritual' },
                    { label: 'Bhutan – The Last Himalayan Buddhist Kingdom', href: '/tours/bhutan-spiritual' },
                    { label: 'Mauritius – Indian Ocean Spiritual Heritage', href: '/tours/mauritius-spiritual' },
                    { label: 'Malaysia – Temple & Cultural Traditions', href: '/tours/malaysia-cultural' },
                    { label: 'Indonesia – Ancient Hindu-Buddhist Legacy (Bali & Java)', href: '/tours/indonesia-legacy' },
                    { label: 'Cambodia – Temple Civilisation Heritage', href: '/tours/cambodia-heritage' },
                    { label: 'Vietnam – Cultural & Spiritual Landscapes', href: '/tours/vietnam-spiritual' },
                ],
            },
            {
                label: 'Customized Packages',
                href: '/tours/customized-packages',
            },
        ],
    },
    {
        label: 'Destinations',
        children: [
            { label: 'Himalayan & Northern India Journeys', href: '/destinations/north-india' },
            { label: 'Sacred South India Experiences', href: '/destinations/south-india' },
            { label: 'Eastern Cultural Routes', href: '/destinations/east-india' },
            { label: 'Royal Western India Trails', href: '/destinations/west-india' },
            { label: 'Central India Legacy Landscapes', href: '/destinations/central-india' },
        ],
    },
    {
        label: 'Services',
        children: [
            { label: 'Flight Bookings', href: '/services/flight-bookings' },
            { label: 'Hotel Reservations', href: '/services/hotel-reservations' },
            { label: 'Visa Assistance', href: '/services/visa-assistance' },
            { label: 'Cab Transfers', href: '/services/cab-transfers' },
            { label: 'Travel Insurance', href: '/services/travel-insurance' },
        ],
    },
    {
        label: 'Blog',
        href: '/blogs',
    },
    {
        label: 'About Us',
        href: '/about',
    },

];
