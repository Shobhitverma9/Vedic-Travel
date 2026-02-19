
const fetch = require('node-fetch');

const PORT = 5000;
const API_PREFIX = 'api/v1';
const BASE_URL = `http://127.0.0.1:${PORT}/${API_PREFIX}`;

async function check() {
    console.log(`Checking GET ${BASE_URL}/yatras ...`);
    try {
        const res = await fetch(`${BASE_URL}/yatras`);
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

check();
