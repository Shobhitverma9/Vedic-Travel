
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Schema } from 'mongoose';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

const TourSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days
    locations: { type: [String], required: true },
    itinerary: { type: [Object], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    maxGroupSize: { type: Number, required: true },
    availableDates: { type: [Date], default: [] },
    isActive: { type: Boolean, default: true },
    totalBookings: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    category: { type: String },
    highlights: { type: Object },
    isFavorite: { type: Boolean, default: false },
    favoriteSize: { type: String, default: 'standard' },
}, { timestamps: true });

const TourModel = mongoose.model('Tour', TourSchema);

const favorites = [
    {
        title: 'Panch Jyotirlinga with Shirdi',
        slug: 'panch-jyotirlinga-shirdi',
        description: 'Experience the divine energy of five Jyotirlingas along with the sacred shrine of Shirdi Sai Baba. A journey of faith and devotion.',
        images: ['/images/tours/panch_jyotirlinga.png'],
        price: 25000,
        duration: 6, // 5N/6D
        locations: ['Pune', 'Bhimashankar', 'Trimbakeshwar', 'Shirdi', 'Grishneshwar', 'Aundha Nagnath', 'Parli Vaijnath'],
        maxGroupSize: 20,
        isFavorite: true,
        favoriteSize: 'wide',
        category: 'pilgrimage',
    },
    {
        title: 'Diversified Odisha',
        slug: 'diversified-odisha',
        description: 'Explore the architectural marvels and spiritual heritage of Odisha. Visit Jagannath Puri, Konark Sun Temple, and ancient caves.',
        images: ['/images/tours/diversified_odisha.png'],
        price: 18000,
        duration: 5, // 4N/5D
        locations: ['Bhubaneswar', 'Puri', 'Konark', 'Chilika'],
        maxGroupSize: 15,
        isFavorite: true,
        favoriteSize: 'standard',
        category: 'cultural',
    },
    {
        title: 'Mahakaleshwar & Omkareshwar',
        slug: 'mahakaleshwar-omkareshwar',
        description: 'Darshan of two powerful Jyotirlingas in Madhya Pradesh. Witness the Bhasma Aarti at Mahakaleshwar and the serenity of Omkareshwar.',
        images: ['/images/tours/mahakaleshwar_omkareshwar.png'],
        price: 12000,
        duration: 3, // 2N/3D
        locations: ['Indore', 'Ujjain', 'Omkareshwar'],
        maxGroupSize: 20,
        isFavorite: true,
        favoriteSize: 'standard',
        category: 'pilgrimage',
    },
    {
        title: 'Divine South India Circuit',
        slug: 'divine-south-india-circuit',
        description: 'A spiritual journey through the grand temples of South India. Visit Madurai Meenakshi, Rameswaram, and Kanyakumari.',
        images: ['/images/tours/divine_south_india.png'],
        price: 16000,
        duration: 4, // 3N/4D
        locations: ['Madurai', 'Rameswaram', 'Kanyakumari'],
        maxGroupSize: 18,
        isFavorite: true,
        favoriteSize: 'standard',
        category: 'temple',
    },
    {
        title: 'Chardham Heli Yatra',
        slug: 'chardham-heli-yatra',
        description: 'The ultimate pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath by helicopter. Comfort, convenience, and divinity combined.',
        images: ['/images/tours/chardham_heli_yatra.png'],
        price: 180000,
        duration: 6, // 5N/6D
        locations: ['Dehradun', 'Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'],
        maxGroupSize: 6,
        isFavorite: true,
        favoriteSize: 'large',
        category: 'pilgrimage',
    },
    {
        title: 'UP Golden Triangle',
        slug: 'up-golden-triangle',
        description: 'A sacred triangle of Ayodhya (Ram Janmabhoomi), Prayagraj (Triveni Sangam), and Varanasi (Kashi Vishwanath).',
        images: ['/images/tours/up_golden_triangle.png'],
        price: 22000,
        duration: 6, // 5N/6D
        locations: ['Ayodhya', 'Prayagraj', 'Varanasi'],
        maxGroupSize: 20,
        isFavorite: true,
        favoriteSize: 'standard',
        category: 'pilgrimage',
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const tourData of favorites) {
            const existing = await TourModel.findOne({ slug: tourData.slug });
            if (existing) {
                console.log(`Updating ${tourData.title}...`);
                await TourModel.updateOne({ slug: tourData.slug }, { $set: tourData });
            } else {
                console.log(`Creating ${tourData.title}...`);
                await TourModel.create(tourData);
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
