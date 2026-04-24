
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
    const seed = Math.floor(Math.random() * 1000000);
    console.log(`🎨 Gerando imagem ÚNICA (Seed: ${seed}) para: "${title}"`);
    
    // Prompt ultra-específico para evitar generalização
    const visualPrompt = `High-end clinical photography, realistic, child psychology, theme: ${title}, cinematic lighting, professional gear, 8k, highly detailed. No text.`;
    const encodedPrompt = encodeURIComponent(visualPrompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&seed=${seed}&model=flux`;

    try {
        console.log('📡 Capturando imagem exclusiva da IA...');
        const response = await fetch(pollinationsUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `unique-post-${Date.now()}-${seed}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(fileName, buffer, { contentType: 'image/png' });

        if (uploadError) return pollinationsUrl;

        const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        return urlData.publicUrl;
    } catch (e) {
        return `https://images.unsplash.com/featured/?psychology,child,${title.split(' ')[0]}`;
    }
}

async function runEngine() {
    console.log('🚀 MOTOR DE AUTORIDADE LÉIA NEVES (IMAGEM ILIMITADA)');
    
    // 1. Definir o ciclo de categorias
    const categoriesCycle = [
        'Aprendizagem', 'Métodos de Ensino', 'Desenvolvimento', 'Emoções', 
        'Intervenções', 'Família & Escola', 'Tecnologia', 'Inclusão', 
        'Pesquisas', 'Autocuidado', 'Motivação', 'Criatividade'
    ];

    // 2. Descobrir qual foi a última categoria gerada
    let nextCategory = categoriesCycle[0];
    try {
        const { data: lastPosts } = await supabase
            .from('blog_posts')
            .select('category')
            .order('created_at', { ascending: false })
            .limit(1);

        if (lastPosts && lastPosts.length > 0) {
            const lastCategory = lastPosts[0].category;
            const currentIndex = categoriesCycle.indexOf(lastCategory);
            
            if (currentIndex !== -1) {
                // Pega a próxima, se for a última, volta para a primeira (0)
                const nextIndex = (currentIndex + 1) % categoriesCycle.length;
                nextCategory = categoriesCycle[nextIndex];
            }
        }
    } catch (e) {
        console.warn('⚠️ Não foi possível verificar o último post. Começando o ciclo do zero.');
    }

    console.log(`\n📅 TEMA DA SEMANA SELECIONADO: [${nextCategory.toUpperCase()}]`);

    const modelsToTry = ["gemini-2.0-flash-lite", "gemma-3-27b-it", "gemini-pro-latest"];
    let responseText = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Gerando conteúdo e descrição visual com: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            const result = await currentModel.generateContent(`
                Atue como uma Psicopedagoga Clínica de renome, especialista em desenvolvimento infantil, TEA e TDAH. 
                Seu objetivo é escrever um artigo inédito e de autoridade para o blog da clínica Léia Neves.
                
                O TEMA OBRIGATÓRIO DESTE ARTIGO É: ${nextCategory}

                Crie um tópico fascinante dentro deste tema.

                REGRAS DE OURO:
                1. TOM DE VOZ: Acolhedor, técnico porém simples, e profundamente empático.
                2. ESTRUTURA: Use títulos (h2, h3), listas e uma citação forte (blockquote).
                3. CONTEÚDO: Comece com a dor do pai/mãe, apresente a solução clínica e termine com esperança.
                4. CTA: No final do texto, convide suavemente para uma conversa no WhatsApp para avaliação.

                Retorne APENAS um JSON:
                - title: Título magnético e focado em SEO.
                - content: O HTML completo do artigo (mínimo 600 palavras).
                - excerpt: Um gancho inicial de 2 frases que instigue a leitura.
                - visual_description: Atue como um Diretor de Arte. Crie uma descrição visual ÚNICA e CINEMATOGRÁFICA. 
                    - VARIE O ÂNGULO: Alterne entre close-up (macro), plano médio (interação), ou vista de cima (flat lay da mesa).
                    - VARIE O CENÁRIO: Consultório moderno, sala de aula inclusiva, parquinho gramado, ou cantinho de estudo.
                    - VARIE O FOCO: Crianças de diferentes idades e etnias, psicopedagoga em ação, ou apenas brinquedos e materiais pedagógicos (ábacos, tangram, massinha).
                    - ILUMINAÇÃO: Use termos como "luz natural suave", "iluminação clínica acolhedora", "raios de sol de fim de tarde".
                    - REGRA: Nunca repita a mesma composição. Cada foto deve parecer de um ensaio fotográfico profissional diferente.
                    - ESTILO: Realistic photography, high-end, 8k, cinematic lighting, no text.
                - meta_title: Para o Google (máx 60 chars).
                - meta_description: Para o Google (máx 160 chars).
                - category: DEVE SER EXATAMENTE A STRING "${nextCategory}".
            `);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) { console.warn(`⚠️ Modelo ${modelName} ocupado.`); }
    }

    if (!responseText) return console.error('❌ Falha na geração.');

    try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        
        // Usando a descrição visual ÚNICA gerada pela IA
        const seed = Math.floor(Math.random() * 999999);
        const visualPrompt = encodeURIComponent(data.visual_description + ", professional clinical style, no text, 8k");
        const imageUrl = `https://image.pollinations.ai/prompt/${visualPrompt}?width=1200&height=800&nologo=true&seed=${seed}&model=flux`;
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
