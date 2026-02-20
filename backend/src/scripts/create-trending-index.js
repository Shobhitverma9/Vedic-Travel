const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const createIndex = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('tours');

        console.log('Creating index on isTrending...');
        const result = await collection.createIndex({ isTrending: -1 });
        console.log(`Index created: ${result}`);

        // Also create compound index for sorting if needed
        // console.log('Creating compound index on isTrending + createdAt...');
        // await collection.createIndex({ isTrending: -1, createdAt: -1 });

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating index:', err);
        process.exit(1);
    }
};

createIndex();
