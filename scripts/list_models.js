
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const models = await genAI.listModels();
        console.log('--- MODELOS DISPONÍVEIS NA SUA CHAVE ---');
        models.models.forEach(m => {
            console.log(`- ${m.name} (Suporta: ${m.supportedMethods.join(', ')})`);
        });
        console.log('---------------------------------------');
    } catch (e) {
        console.error('❌ Erro ao listar modelos:', e.message);
    }
}

list();
