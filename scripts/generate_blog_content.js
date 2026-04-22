
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error('❌ Erro: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY e GEMINI_API_KEY são obrigatórios.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

async function generateImage(title) {
    console.log('🎨 Gerando imagem com Imagen 4.0...');
    try {
        // Usando fetch direto para garantir compatibilidade com Imagen 4.0 em 2026
        const prompt = `A professional, welcoming and high-quality illustration for a blog post about child psychology and atypical development. Theme: ${title}. Style: Clean, modern, soft colors, clinical but friendly. No text in image.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiApiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            })
        });

        const data = await response.json();
        
        if (data.predictions && data.predictions[0].bytesBase64Encoded) {
            const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            const fileName = `post-${Date.now()}.png`;

            console.log('📤 Subindo imagem para o Supabase Storage...');
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, buffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Retornar a URL pública
            const { data: urlData } = supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        }
        return "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000";
    } catch (e) {
        console.error('⚠️ Falha ao gerar imagem:', e.message);
        return "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000";
    }
}

async function generateAutomatedPost() {
    console.log('🤖 Iniciando Motor de IA (Texto + Imagem)...');

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `
        Você é Léia Neves, Psicopedagoga em Salvador (Cajazeiras). 
        Escreva um artigo acolhedor e informativo sobre TEA ou TDAH.
        Inclua as leis de 2024-2026 de Salvador e Bahia.
        Retorne APENAS um JSON com: title, content (HTML), excerpt, meta_title, meta_description, category.
    `;

    try {
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();
        const jsonStr = responseText.replace(/```json|```/g, '').trim();
        const generatedData = JSON.parse(jsonStr);

        // Gerar imagem baseada no título
        const imageUrl = await generateImage(generatedData.title);

        const slug = generatedData.title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();

        const finalPost = {
            ...generatedData,
            slug,
            image_url: imageUrl,
            is_published: true,
            published_at: new Date().toISOString(),
            target_region: "Cajazeiras, Salvador - BA"
        };

        const { error } = await supabase.from('blog_posts').insert([finalPost]);
        if (error) throw error;

        console.log('🎉 SUCESSO! Post completo com imagem publicado!');
        console.log(`🔗 Link: /blog/${finalPost.slug}`);

    } catch (err) {
        console.error('❌ Erro no processo:', err.message);
    }
}

generateAutomatedPost();
