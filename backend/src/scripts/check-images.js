const https = require('https');

// Well-known stable Unsplash photo IDs for relevant destinations
const candidates = [
    // Varanasi / Ghats
    { label: 'Varanasi ghats 1', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Varanasi ghats 2', url: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Varanasi ghats 3', url: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=2070&auto=format&fit=crop' },
    // Ayodhya / Hindu temple
    { label: 'Hindu temple 1', url: 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Hindu temple 2', url: 'https://images.unsplash.com/photo-1623492700272-f7bc929bb4a9?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Hindu temple 3', url: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2070&auto=format&fit=crop' },
    // Char Dham / helicopter aerial Himalayas
    { label: 'Himalayas aerial 1', url: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Himalayas 2', url: 'https://images.unsplash.com/photo-1580200131992-e73b0c94ce8c?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Himalayas 3', url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop' },
    // Puri / ocean temple
    { label: 'Puri temple 1', url: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Puri / sea 1', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop' },
    { label: 'Puri / sea 2', url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=2070&auto=format&fit=crop' },
];

function checkUrl(label, url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            const status = res.statusCode;
            res.destroy();
            console.log(`[${status}] ${label}: ${url}`);
            resolve({ label, url, status });
        }).on('error', (e) => {
            console.log(`[ERR] ${label}: ${e.message}`);
            resolve({ label, url, status: 0 });
        });
    });
}

async function run() {
    const results = [];
    for (const c of candidates) {
        const r = await checkUrl(c.label, c.url);
        results.push(r);
    }
    console.log('\nValid URLs:');
    results.filter(r => r.status === 200).forEach(r => console.log(`  ${r.label}: ${r.url}`));
}

run();
