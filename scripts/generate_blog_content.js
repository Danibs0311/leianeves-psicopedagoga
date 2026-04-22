
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

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

async function generateImage(imageDescription) {
    console.log('🎨 Gerando imagem realista com Imagen 4.0...');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiApiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                instances: [{ prompt: imageDescription + " Realistic photography, soft lighting, professional high resolution." }],
                parameters: { sampleCount: 1 }
            })
        });

        const data = await response.json();
        if (data.predictions && data.predictions[0].bytesBase64Encoded) {
            const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            const fileName = `blog-${Date.now()}.png`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, buffer, { contentType: 'image/png', upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            return urlData.publicUrl;
        }
    } catch (e) {
        console.error('⚠️ Erro na imagem:', e.message);
    }
    return "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000";
}

async function runEngine() {
    console.log('🚀 Iniciando Motor de Autoridade (Prompt Master)...');

    const modelsToTry = ["gemini-2.0-flash-lite", "gemma-3-27b-it", "gemini-pro-latest"];
    let responseText = null;

    const topics = [
        "Como identificar sinais de autismo (TEA) em crianças de 2 a 5 anos",
        "TDAH ou apenas agitação? Como saber a hora de procurar ajuda",
        "A importância do diagnóstico em Cajazeiras: Onde começar em Salvador",
        "Dificuldades de alfabetização: O papel do psicopedagogo",
        "Novas leis de inclusão em 2026: O que os pais precisam saber"
    ];
    const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Tentando modelo: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            
            const masterPrompt = `
                Atue como um especialista em marketing de conteúdo, SEO e psicopedagogia.
                Crie um artigo completo para blog voltado para pais e educadores.
                TEMA: ${chosenTopic}
                FOCO: Cajazeiras, Salvador. Léia Neves Psicopedagoga.
                REQUISITO: Texto longo (800+ palavras), tom acolhedor, estrutura H2/H3.
                
                RETORNE APENAS JSON:
                {
                    "title": "...",
                    "content": "HTML...",
                    "excerpt": "...",
                    "image_description": "Cena realista para IA...",
                    "meta_title": "...",
                    "meta_description": "...",
                    "category": "..."
                }
            `;

            const result = await currentModel.generateContent(masterPrompt);
            responseText = result.response.text();
            if (responseText) {
                console.log(`✅ Sucesso com o modelo: ${modelName}`);
                break;
            }
        } catch (err) {
            console.warn(`⚠️ Modelo ${modelName} falhou: ${err.message.substring(0, 50)}...`);
        }
    }

    if (!responseText) {
        console.error('❌ Todos os modelos falharam devido à cota gratuita.');
        return;
    }

    try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        const imageUrl = await generateImage(data.image_description);
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
            published_at: new Date().toISOString(),
            target_region: "Cajazeiras, Salvador - BA"
        };

        const { error } = await supabase.from('blog_posts').insert([post]);
        if (error) throw error;

        console.log('🎉 SUCESSO! Artigo de autoridade publicado!');
        console.log(`🔗 Link: /blog/${post.slug}`);
    } catch (e) {
        console.error('❌ Erro no processamento final:', e.message);
    }
}

runEngine();
