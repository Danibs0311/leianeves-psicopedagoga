
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function list() {
    const key = process.env.GEMINI_API_KEY;
    console.log('📡 Testando conexão direta com a Google...');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.error('❌ ERRO DA GOOGLE:', data.error.message);
            console.error('Motivo:', data.error.status);
            return;
        }

        console.log('--- MODELOS DISPONÍVEIS ---');
        data.models.forEach(m => {
            console.log(`- ${m.name}`);
        });
    } catch (e) {
        console.error('❌ Erro de conexão:', e.message);
    }
}

list();
