const dotenv = require('dotenv');
const path = require('path');

// Load .env from the current directory
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully');
}

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
