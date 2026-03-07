
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');

try {
    const schema = fs.readFileSync('setup_document_system.sql', 'utf8');
    const seed = fs.readFileSync('seed_data.sql', 'utf8');
    fs.writeFileSync('install_documents.sql', schema + '\n\n' + seed);
    console.log('Merged install_documents.sql created.');
} catch (e) {
    console.error(e);
}
