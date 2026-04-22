
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

// Configuração
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error('❌ Erro: Faltam chaves no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

async function generateImage(title) {
    console.log('🎨 Tentando gerar imagem (Imagen 4.0 -> Unsplash Fallback)...');
    try {
        // Tentativa com Imagen 4.0
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiApiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                instances: [{ prompt: `Professional child psychology illustration about ${title}. Soft colors, high resolution.` }],
                parameters: { sampleCount: 1 }
            })
        });

        const data = await response.json();
        if (data.predictions && data.predictions[0].bytesBase64Encoded) {
            const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            const fileName = `blog-${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, buffer, { contentType: 'image/png' });
            if (!uploadError) {
                const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
                return urlData.publicUrl;
            }
        }
    } catch (e) {
        console.warn('⚠️ Imagen 4.0 falhou, usando Unsplash...');
    }
    
    // Fallback: Unsplash (Garante que nunca fique sem imagem)
    const keywords = title.split(' ').slice(0, 3).join(',');
    return `https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000&sig=${Date.now()}`;
}

async function runEngine() {
    console.log('🚀 Gerando Artigo de Autoridade (Foco Amplo)...');

    const modelsToTry = ["gemini-2.0-flash-lite", "gemma-3-27b-it", "gemini-pro-latest"];
    let responseText = null;

    const topics = [
        "Sinais precoces de Autismo: O que observar nos primeiros anos",
        "Como o TDAH impacta o aprendizado e como ajudar seu filho",
        "Dislexia: Estratégias práticas para pais e educadores",
        "A importância do acolhimento familiar em diagnósticos atípicos",
        "Desenvolvimento infantil: Marcos importantes e quando se preocupar"
    ];
    const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Usando: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            
            const masterPrompt = `
                Atue como um especialista em psicopedagogia e marketing de conteúdo.
                Crie um artigo de blog profundo e informativo.
                TEMA: ${chosenTopic}
                REQUISITO: Texto longo (800+ palavras), tom profissional e acolhedor.
                ESTRUTURA: H2, H3, Introdução emocional, Lista de sinais, Dicas práticas.
                IMPORTANTE: Não foque o texto ou título em uma região específica. Foque no conhecimento técnico e humano.
                CTA FINAL: Inclua um convite para atendimento especializado com Léia Neves em Cajazeiras, Salvador.

                RETORNE APENAS JSON:
                {
                    "title": "...",
                    "content": "HTML...",
                    "excerpt": "...",
                    "meta_title": "...",
                    "meta_description": "...",
                    "category": "..."
                }
            `;

            const result = await currentModel.generateContent(masterPrompt);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) {
            console.warn(`⚠️ Erro no modelo ${modelName}`);
        }
    }

    if (!responseText) return console.error('❌ Cota esgotada.');

    try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        const imageUrl = await generateImage(data.title);
        const slug = data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();

        const post = {
            title: data.title,
            slug,
            content: data.content,
            excerpt: data.excerpt,
            image_url: imageUrl,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            category: data.category,
            is_published: true,
            published_at: new Date().toISOString()
        };

        const { error } = await supabase.from('blog_posts').insert([post]);
        if (error) throw error;

        console.log('🎉 PUBLICADO: ' + post.title);
        console.log('🔗 /blog/' + post.slug);

        // Chamar sincronização automática do Git
        try {
            console.log('🔄 Iniciando sincronização do código...');
            execSync(`${process.execPath} scripts/auto_sync.js`);
        } catch (syncErr) {
            console.warn('⚠️ Post publicado, mas falha no Sync Git:', syncErr.message);
        }
    } catch (e) {
        console.error('❌ Erro final:', e.message);
    }
}

runEngine();
