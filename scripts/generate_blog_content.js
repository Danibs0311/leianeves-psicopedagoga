
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error('❌ Faltam variáveis de ambiente.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// BASE DE CONHECIMENTO (ATÉ ABRIL 2026)
const knowledgeBase = {
    region: "Cajazeiras, Salvador - Bahia",
    laws_2026: [
        "Lei Federal 15.256/2025 (Diagnóstico TEA em todas as fases)",
        "Lei Municipal 9.915/2025 (Salvador: Prioridade de matrícula)",
        "Lei Estadual 14.661/2024 (Bahia: Cinema adaptado)"
    ]
};

async function generateWithFallback() {
    console.log('🤖 Iniciando Motor de IA com Auto-Tentativa...');

    // Lista de modelos para tentar (em ordem de preferência)
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "models/gemini-1.5-flash"];
    
    let model;
    let responseText;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Tentando modelo: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = `
                Escreva um artigo de blog acolhedor e informativo para Léia Neves (Psicopedagoga em Salvador).
                FOCO: TEA e TDAH.
                CONTEXTO: Cajazeiras, Salvador - BA.
                LEGISLAÇÃO: Inclua menção à Lei Municipal 9.915/2025 de Salvador sobre prioridade de matrícula escolar.
                DATA: Abril de 2026.
                
                SAÍDA (JSON estrito):
                {
                    "title": "...",
                    "content": "HTML...",
                    "excerpt": "...",
                    "meta_title": "...",
                    "meta_description": "...",
                    "category": "..."
                }
            `;

            const result = await currentModel.generateContent(prompt);
            responseText = result.response.text();
            if (responseText) {
                console.log(`✅ Sucesso com o modelo: ${modelName}`);
                break; 
            }
        } catch (err) {
            console.warn(`⚠️ Falha no modelo ${modelName}: ${err.message.substring(0, 50)}...`);
        }
    }

    if (!responseText) {
        console.error('❌ Todos os modelos falharam. Verifique sua GEMINI_API_KEY no .env.local');
        return;
    }

    try {
        const jsonStr = responseText.replace(/```json|```/g, '').trim();
        const generatedData = JSON.parse(jsonStr);

        const slug = generatedData.title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();

        const finalPost = {
            ...generatedData,
            slug,
            image_url: "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000",
            is_published: true,
            published_at: new Date().toISOString(),
            target_region: "Cajazeiras, Salvador - BA"
        };

        const { error } = await supabase.from('blog_posts').insert([finalPost]);
        if (error) throw error;

        console.log('🎉 Post Publicado!');
        console.log(`🔗 Link: /blog/${finalPost.slug}`);
    } catch (err) {
        console.error('❌ Erro ao processar JSON ou salvar no banco:', err.message);
    }
}

generateWithFallback();
