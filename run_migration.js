import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    await client.connect();

    try {
        const sql = fs.readFileSync('setup_document_system.sql', 'utf8');
        await client.query(sql);
        console.log('Schema migration executed successfully.');
    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await client.end();
    }
}

run();
