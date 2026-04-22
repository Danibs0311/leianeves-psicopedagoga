
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

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

function getGitCmd() {
    const localAppData = process.env.LOCALAPPDATA;
    const githubDesktopPath = join(localAppData, 'GitHubDesktop');
    const possiblePaths = ['git', join(githubDesktopPath, 'bin', 'github-git.exe'), 'C:\\Program Files\\Git\\bin\\git.exe'];
    if (existsSync(githubDesktopPath)) {
        try {
            const apps = readdirSync(githubDesktopPath).filter(f => f.startsWith('app-'));
            if (apps.length > 0) possiblePaths.push(join(githubDesktopPath, apps[apps.length - 1], 'resources', 'app', 'git', 'cmd', 'git.exe'));
        } catch (e) {}
    }
    for (const p of possiblePaths) {
        try {
            execSync(`"${p}" --version`, { stdio: 'ignore' });
            return `"${p}"`;
        } catch (e) {}
    }
    return 'git';
}

async function generateImage(title) {
    console.log(`🎨 Gerando imagem personalizada via Pollinations AI para: "${title}"`);
    
    // Criando um prompt visual rico baseado no título do artigo
    const visualPrompt = `Professional editorial photography for a child psychology clinic. Topic: ${title}. Soft natural lighting, realistic style, 8k resolution, emotional and caring atmosphere. No text or watermarks.`;
    const encodedPrompt = encodeURIComponent(visualPrompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&model=flux`;

    try {
        console.log('📡 Baixando imagem única gerada pela IA...');
        const response = await fetch(pollinationsUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `poll-post-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(fileName, buffer, { contentType: 'image/png' });

        if (uploadError) {
            console.warn('⚠️ Erro ao salvar no Supabase, usando link direto da IA.');
            return pollinationsUrl;
        }

        const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        console.log('✅ Imagem salva e sincronizada com o artigo!');
        return urlData.publicUrl;
    } catch (e) {
        console.error('❌ Falha no motor Pollinations:', e.message);
        return "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200";
    }
}

async function runEngine() {
    console.log('🚀 MOTOR DE AUTORIDADE LÉIA NEVES (IMAGEM ILIMITADA)');
    const modelsToTry = ["gemini-2.0-flash-lite", "gemma-3-27b-it", "gemini-pro-latest"];
    let responseText = null;

    const topics = [
        "Sinais de TEA: Guia definitivo para pais e cuidadores",
        "TDAH e Alfabetização: Como superar os desafios na escola",
        "O impacto da tecnologia no desenvolvimento emocional infantil",
        "Legislação de Inclusão 2026: Direitos garantidos na escola",
        "Ansiedade infantil: Como identificar e acolher seu filho"
    ];
    const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Gerando conteúdo com: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            const result = await currentModel.generateContent(`
                Atue como especialista em psicopedagogia. Crie um artigo magistral sobre: ${chosenTopic}.
                Retorne APENAS JSON com title, content (HTML), excerpt, meta_title, meta_description, category.
                Foque em autoridade clínica e tom acolhedor.
            `);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) { console.warn(`⚠️ Modelo ${modelName} ocupado.`); }
    }

    if (!responseText) return console.error('❌ Falha na geração de texto.');

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

        console.log(`🎉 PUBLICADO: ${post.title}`);
        console.log(`🖼️ IMAGEM ÚNICA: ${post.image_url}`);

        try {
            const gitCmd = getGitCmd();
            execSync(`${gitCmd} add .`);
            execSync(`${gitCmd} commit -m "Auto-publish: ${data.title}"`);
            execSync(`${gitCmd} push`);
            console.log('✅ Tudo sincronizado no GitHub.');
        } catch (sErr) {}
    } catch (e) { console.error('❌ Erro final:', e.message); }
}

runEngine();
