const axios = require('axios');
const crypto = require('crypto');

/**
 * SIMULATION SCRIPT: Verify Backend logic for Payment Success
 * 
 * This script simulates the response from PayU to verify that the 
 * backend correctly updates the booking status and triggers emails.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';
const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'your-test-salt';
const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'your-test-key';

async function simulatePaymentSuccess(bookingId, txnid, amount, email, firstname, productinfo) {
    console.log(`🚀 Simulating payment success for booking: ${bookingId}`);

    // Generate the hash that the backend expects in the response
    // Formula: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const status = 'success';
    const hashString = `${MERCHANT_SALT}|${status}||||||||||${bookingId}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${MERCHANT_KEY}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const payload = {
        status,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        mihpayid: 'SIMULATED_PAYU_ID_' + Date.now(),
        udf1: bookingId,
        hash
    };

    try {
        const response = await axios.post(`${BACKEND_URL}/payments/verify`, payload);
        console.log('✅ Simulation request sent.');
        console.log('Response Status:', response.status);
        console.log('Redirect URL (Backend result):', response.headers.location);
    } catch (error) {
        console.error('❌ Simulation failed:', error.response ? error.response.data : error.message);
    }
}

// Example usage (run with node test-deployment-flow.js <bookingId> <txnid> <amount> <email> <name> <productinfo>)
const args = process.argv.slice(2);
if (args.length >= 6) {
    simulatePaymentSuccess(...args);
} else {
    console.log('Usage: node test-deployment-flow.js <bookingId> <txnid> <amount> <email> <name> <productinfo>');
    console.log('Ensure BACKEND_URL, PAYU_MERCHANT_SALT, and PAYU_MERCHANT_KEY are set.');
}
