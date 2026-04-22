
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
    const possiblePaths = [
        'git',
        join(githubDesktopPath, 'bin', 'github-git.exe'),
        'C:\\Program Files\\Git\\bin\\git.exe'
    ];
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
    console.log(`🎨 Buscando imagem profissional para: "${title}"`);
    
    // Banco de imagens reais (Unsplash IDs) relacionadas a psicopedagogia
    const gallery = [
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9", // Criança estudando
        "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28", // Blocos de montar
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c", // Crianças brincando
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74", // Criança feliz
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b", // Apoio e cuidado
        "https://images.unsplash.com/photo-1513258496099-48168024adb0"  // Escrita e aprendizado
    ];

    try {
        // Tentativa de IA (Imagen 4.0)
        const prompt = `Premium photography for a child psychology blog. Topic: ${title}. Soft focus, high resolution, professional.`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${geminiApiKey}`, {
            method: 'POST',
            body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1 } })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.predictions && data.predictions[0].bytesBase64Encoded) {
                const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
                const fileName = `ai-post-${Date.now()}.png`;
                const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, buffer, { contentType: 'image/png' });
                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
                    console.log('✅ IA gerou uma imagem exclusiva!');
                    return urlData.publicUrl;
                }
            }
        }
    } catch (e) {
        console.warn('⚠️ IA sem cota, selecionando imagem da galeria premium...');
    }

    // Escolha aleatória da galeria profissional caso a IA falhe
    const randomImg = gallery[Math.floor(Math.random() * gallery.length)];
    const finalUrl = `${randomImg}?auto=format&fit=crop&q=80&w=1200`;
    console.log('📸 Imagem selecionada:', finalUrl);
    return finalUrl;
}

async function runEngine() {
    console.log('🚀 MOTOR DE AUTORIDADE LÉIA NEVES 2026');
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
            console.log(`📡 Consultando: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            const result = await currentModel.generateContent(`
                Atue como especialista em psicopedagogia. Crie um artigo magistral sobre: ${chosenTopic}.
                Retorne JSON com title, content (HTML), excerpt, meta_title, meta_description, category.
            `);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) { console.warn(`⚠️ Modelo ${modelName} falhou.`); }
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

        console.log(`🎉 PUBLICADO: ${post.title}`);
        console.log(`🖼️ IMAGEM: ${post.image_url}`);

        try {
            const gitCmd = getGitCmd();
            execSync(`${gitCmd} add .`);
            execSync(`${gitCmd} commit -m "Auto-publish: ${data.title}"`);
            execSync(`${gitCmd} push`);
            console.log('✅ Git Sincronizado.');
        } catch (sErr) {}
    } catch (e) { console.error('❌ Erro:', e.message); }
}

runEngine();
