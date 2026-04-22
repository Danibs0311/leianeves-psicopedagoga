
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
    console.log(`🎨 Iniciando processo de imagem para: "${title}"`);
    
    try {
        // Tentativa com Imagen 4.0 Fast (Mais chance de ter cota)
        const prompt = `A professional and high-quality photography for a blog about child psychology. Theme: ${title}. Soft lighting, clean environment, realistic style. No text.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${geminiApiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            })
        });

        const data = await response.json();
        
        if (data.predictions && data.predictions[0].bytesBase64Encoded) {
            console.log('✅ Imagem gerada pela IA com sucesso!');
            const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            const fileName = `post-${Date.now()}.png`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, buffer, { contentType: 'image/png', upsert: true });

            if (uploadError) {
                console.warn('⚠️ Erro ao subir para o Storage:', uploadError.message);
                throw uploadError;
            }

            const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            console.log('🔗 Imagem salva no Storage:', urlData.publicUrl);
            return urlData.publicUrl;
        } else {
            console.warn('⚠️ Imagen 4.0 não retornou dados (Cota ou Erro). Usando Unsplash...');
        }
    } catch (e) {
        console.warn('⚠️ Falha no motor de imagem:', e.message);
    }
    
    // Backup garantido: Unsplash de alta qualidade (URL Moderna 2026)
    const keywords = encodeURIComponent(title.split(' ').slice(0, 3).join(','));
    const unsplashUrl = `https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1200&h=800&sig=${Date.now()}`;
    console.log('📸 Usando imagem do Unsplash como backup:', unsplashUrl);
    return unsplashUrl;
}

async function runEngine() {
    console.log('🚀 Iniciando Motor de Autoridade...');

    const modelsToTry = ["gemini-2.0-flash-lite", "gemma-3-27b-it", "gemini-pro-latest"];
    let responseText = null;

    const topics = [
        "Como identificar sinais de autismo (TEA) em crianças de 2 a 5 anos",
        "TDAH ou apenas agitação? Como saber a hora de procurar ajuda",
        "A importância do diagnóstico precoce no desenvolvimento infantil",
        "Dificuldades de alfabetização: Quando é hora de intervir?",
        "Estratégias para lidar com crises sensoriais no dia a dia"
    ];
    const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Usando: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            
            const masterPrompt = `
                Atue como um especialista em psicopedagogia. Crie um artigo completo.
                TEMA: ${chosenTopic}
                REQUISITO: 800+ palavras, tom acolhedor.
                CTA: Atendimento em Salvador com Léia Neves.
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
            console.warn(`⚠️ Modelo ${modelName} indisponível.`);
        }
    }

    if (!responseText) return console.error('❌ Cota de texto esgotada.');

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
        console.log('🔗 Link do Post: /blog/' + post.slug);
        console.log('🖼️ Link da Imagem: ' + post.image_url);
        try {
            console.log('🔄 Sincronizando código...');
            execSync(`${process.execPath} scripts/auto_sync.js`);
        } catch (s) {
            console.warn('⚠️ Falha no sync git, mas post foi publicado.');
        }
    } catch (e) {
        console.error('❌ Erro final:', e.message);
    }
}

runEngine();
