const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const trendingSlugs = [
    'char-dham-helicopter-5d4n',
    'kailash-mansarovar-yatra-standard-package',
    'adi-kailash-om-parvat-yatra-standard-package',
    'khatushyam-salasar-jaipur-standard-package',
    'golden-triangle-up-standard-package',
    'vaishno-devi-yatra-standard-package',
    'shakti-circuit-himachal-standard-package'
];

const updateTrendingTours = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB.');

        // Define Tour schema (minimal needed)
        const tourSchema = new mongoose.Schema({
            slug: String,
            isTrending: Boolean
        }, { strict: false });

        const Tour = mongoose.model('Tour', tourSchema);

        console.log('Resetting isTrending for all tours...');
        const resetResult = await Tour.updateMany({}, { $set: { isTrending: false } });
        console.log(`Reset complete. Modified ${resetResult.modifiedCount} documents.`);

        console.log('Updating specific tours to be trending...');
        let successCount = 0;
        let notFoundCount = 0;

        for (const slug of trendingSlugs) {
            const result = await Tour.updateOne(
                { slug: slug },
                { $set: { isTrending: true } }
            );

            if (result.matchedCount > 0) {
                console.log(`✅ Marked as trending: ${slug}`);
                successCount++;
            } else {
                console.log(`❌ Tour not found: ${slug}`);
                notFoundCount++;
            }
        }

        console.log('-----------------------------------');
        console.log(`Update complete.`);
        console.log(`Successfully updated: ${successCount}`);
        console.log(`Not found: ${notFoundCount}`);

        process.exit(0);
    } catch (err) {
        console.error('Error during update:', err);
        process.exit(1);
    }
};

updateTrendingTours();
