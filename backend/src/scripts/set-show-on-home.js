const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const HOME_YATRA_SLUGS = [
    'char-dham-yatra',
    'kailash-mansarovar-yatra',
    'khatushyam-salasar-jaipur',
];

const run = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const yatraSchema = new mongoose.Schema({}, { strict: false });
        const Yatra = mongoose.model('Yatra', yatraSchema);

        // Reset all yatras first
        await Yatra.updateMany({}, { $set: { showOnHome: false } });
        console.log('Reset showOnHome=false for all yatras.');

        // Set the 3 chosen yatras
        const result = await Yatra.updateMany(
            { slug: { $in: HOME_YATRA_SLUGS } },
            { $set: { showOnHome: true } }
        );
        console.log(`Set showOnHome=true for ${result.modifiedCount} yatras:`, HOME_YATRA_SLUGS);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

run();
