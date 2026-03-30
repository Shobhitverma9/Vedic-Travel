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

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@vedictravel.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const existingAdmin = await User.findOne({ email: adminEmail });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        if (existingAdmin) {
            console.log('Admin user already exists. Updating credentials...');
            existingAdmin.password = hashedPassword;
            existingAdmin.name = 'Admin User';
            existingAdmin.role = 'admin';
            existingAdmin.isActive = true;
            existingAdmin.emailVerified = true;
            existingAdmin.phoneVerified = true;
            await existingAdmin.save();
            console.log('Admin User Updated Successfully!');
        } else {
            console.log('Creating admin user...');
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
        }
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedAdmin();
