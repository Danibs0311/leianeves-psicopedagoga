import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('documentos/MODELOS-DE-DOCUMENTOS-PSICOPEDAGOGICOS-GRATUITOS.pdf');

// Simple API for v1.1.1
pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('extracted_templates.txt', data.text);
    console.log('Extraction complete! Check extracted_templates.txt');
}).catch(err => {
    console.error('Error extracting PDF:', err);
});
