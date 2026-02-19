const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedictravel';

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String,
            isActive: Boolean,
            emailVerified: Boolean,
            phoneVerified: Boolean,
        }, { strict: false, timestamps: true });

        const User = mongoose.model('User', userSchema);

        const adminEmail = 'admin@vedictravel.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            console.log('Email:', adminEmail);
            console.log('If you forgot the password, please delete the user from DB and run this script again.');
        } else {
            console.log('Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                emailVerified: true,
                phoneVerified: true,
            });

            console.log('Admin User Created Successfully!');
            console.log('Email: admin@vedictravel.com');
            console.log('Password: admin123');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedAdmin();
