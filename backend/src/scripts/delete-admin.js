const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const deleteAdmin = async () => {
    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        await db.collection('users').deleteOne({ email: 'admin@vedictravel.com' });
        console.log('Admin user deleted.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

deleteAdmin();
