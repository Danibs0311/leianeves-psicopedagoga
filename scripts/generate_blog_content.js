
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

// Função para encontrar o Git de forma robusta (Windows/GitHub Desktop)
function getGitCmd() {
    const localAppData = process.env.LOCALAPPDATA;
    const githubDesktopPath = join(localAppData, 'GitHubDesktop');
    const possiblePaths = [
        'git',
        join(githubDesktopPath, 'bin', 'github-git.exe'),
        'C:\\Program Files\\Git\\bin\\git.exe',
        'C:\\Program Files (x86)\\Git\\bin\\git.exe'
    ];

    if (existsSync(githubDesktopPath)) {
        try {
            const apps = readdirSync(githubDesktopPath).filter(f => f.startsWith('app-'));
            if (apps.length > 0) {
                possiblePaths.push(join(githubDesktopPath, apps[apps.length - 1], 'resources', 'app', 'git', 'cmd', 'git.exe'));
            }
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
    console.log(`🎨 Motor de Imagem Ativado para: "${title}"`);
    
    try {
        // Tentativa 1: Imagen 4.0 Fast
        const prompt = `Professional photography, high-end editorial style, child development context, theme: ${title}. Soft natural lighting, premium colors, cinematic composition.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${geminiApiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.predictions && data.predictions[0].bytesBase64Encoded) {
                console.log('✅ IA desenhou uma imagem exclusiva!');
                const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
                const fileName = `ai-post-${Date.now()}.png`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, buffer, { contentType: 'image/png' });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
                    return urlData.publicUrl;
                }
            }
        }
    } catch (e) {
        console.warn('⚠️ Imagen 4.0 offline ou sem cota.');
    }
    
    // Fallback: Unsplash de alta resolução com tags dinâmicas
    const tags = "child,education,psychology,learning";
    const fallbackUrl = `https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200&h=800&sig=${Date.now()}`;
    console.log('📸 Usando imagem premium do banco de dados visual.');
    return fallbackUrl;
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
            console.log(`📡 Consultando Inteligência: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            
            const masterPrompt = `
                Atue como o maior especialista em Psicopedagogia e Conteúdo Educativo do Brasil.
                Escreva um artigo MAGISTRAL para o blog de Léia Neves.
                
                TEMA: ${chosenTopic}
                TOM: Clínico porém acolhedor, autoridade total, sem regionalismos excessivos no título.
                ESTRUTURA: H2 atraentes, H3 explicativos, listas de sinais, conclusão com esperança.
                REQUISITO: 1000+ palavras de puro valor.
                
                SAÍDA EM JSON:
                {
                    "title": "Título Impactante SEO",
                    "content": "HTML semântico...",
                    "excerpt": "Resumo magnético para o card...",
                    "meta_title": "SEO Title...",
                    "meta_description": "Meta description...",
                    "category": "Saúde/Educação/Família"
                }
            `;

            const result = await currentModel.generateContent(masterPrompt);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) {
            console.warn(`⚠️ Modelo ${modelName} ignorado.`);
        }
    }

    if (!responseText) return console.error('❌ Falha crítica: Cota esgotada em todos os modelos.');

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

        console.log(`🎉 ARTIGO PUBLICADO COM SUCESSO!`);
        console.log(`🔗 Link: /blog/${post.slug}`);
        console.log(`🖼️ Imagem: ${post.image_url}`);

        // Sincronização Automática Git sem confirmação
        try {
            console.log('🔄 Sincronizando alterações no Git...');
            const gitCmd = getGitCmd();
            execSync(`${gitCmd} add .`);
            execSync(`${gitCmd} commit -m "Auto-publish: ${data.title}"`);
            execSync(`${gitCmd} push`);
            console.log('✅ Git Sincronizado.');
        } catch (sErr) {
            console.warn('⚠️ Git Sync falhou (normal se não houver mudanças de código).');
        }
    } catch (e) {
        console.error('❌ Erro no processamento do artigo:', e.message);
    }
}

runEngine();
