import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const dataBuffer = fs.readFileSync('public/Quando Aprender Não é  Simples.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('tmp_ebook_content.txt', data.text);
    console.log('Extraction complete. Lines:', data.text.split('\n').length);
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
