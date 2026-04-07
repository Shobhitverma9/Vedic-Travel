const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const Tour = mongoose.model('Tour', new mongoose.Schema({}, { strict: false }));
        const Yatra = mongoose.model('Yatra', new mongoose.Schema({}, { strict: false }));

        const keywords = [
            'Char Dham', 
            'Do Dham', 
            'Kailash Mansarovar', 
            'Vietnam', 
            'Spiritual Heritage Expedition', 
            'Heavenly Kashmir', 
            'Temple & Tides'
        ];

        console.log('--- TOURS ---');
        for (const kw of keywords) {
            const tours = await Tour.find({ title: new RegExp(kw, 'i') });
            tours.forEach(t => {
                console.log(`Keyword: ${kw}`);
                console.log(`Title: ${t.title}`);
                console.log(`Slug: ${t.slug}`);
                console.log(`Price: ${t.price}`);
                console.log(`Duration: ${t.duration}`);
                console.log(`Image: ${t.images?.[0]}`);
                console.log('---');
            });
        }

        console.log('--- YATRAS ---');
        for (const kw of keywords) {
            const yatras = await Yatra.find({ title: new RegExp(kw, 'i') });
            yatras.forEach(y => {
                console.log(`Keyword: ${kw}`);
                console.log(`Title: ${y.title}`);
                console.log(`Slug: ${y.slug}`);
                console.log(`Price: ${y.price}`); // Some might be in related packages
                console.log(`Image: ${y.heroImage}`);
                console.log('---');
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
