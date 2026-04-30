
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync } from 'fs';
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
        } catch (e) { }
    }
    for (const p of possiblePaths) {
        try {
            execSync(`"${p}" --version`, { stdio: 'ignore' });
            return `"${p}"`;
        } catch (e) { }
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

    // 1. Carregar os títulos predefinidos
    const titlesPath = resolve(process.cwd(), 'data', 'blog_titles.json');
    let predefinedTitles = {};
    if (existsSync(titlesPath)) {
        predefinedTitles = JSON.parse(readFileSync(titlesPath, 'utf8'));
    }

    // 2. Definir o ciclo de categorias
    const categoriesCycle = [
        'Aprendizagem', 'Métodos de Ensino', 'Desenvolvimento', 'Emoções',
        'Intervenções', 'Família & Escola', 'Tecnologia', 'Inclusão',
        'Pesquisas', 'Autocuidado', 'Motivação', 'Criatividade'
    ];

    // 3. Descobrir qual foi a última categoria gerada e quais os títulos recentes
    let nextCategory = categoriesCycle[0];
    let allPublishedTitles = [];
    try {
        const { data: lastPosts } = await supabase
            .from('blog_posts')
            .select('title, category')
            .order('created_at', { ascending: false });

        if (lastPosts && lastPosts.length > 0) {
            allPublishedTitles = lastPosts.map(p => p.title);
            const lastCategory = lastPosts[0].category;
            const currentIndex = categoriesCycle.indexOf(lastCategory);

            if (currentIndex !== -1) {
                const nextIndex = (currentIndex + 1) % categoriesCycle.length;
                nextCategory = categoriesCycle[nextIndex];
            }
        }
    } catch (e) {
        console.warn('⚠️ Não foi possível verificar o histórico. Seguindo sem lista de exclusão.');
    }

    // 4. Escolher o título predefinido para a categoria atual que ainda não foi usado
    const categoryTitles = predefinedTitles[nextCategory] || [];
    let selectedTitle = categoryTitles.find(t => !allPublishedTitles.includes(t));

    if (!selectedTitle) {
        console.log(`⚠️ Todos os títulos predefinidos para [${nextCategory}] já foram usados ou não existem.`);
        console.log(`🎲 Solicitando ao Gemini que gere um título inédito para manter o fluxo.`);
    } else {
        console.log(`✅ Título selecionado: "${selectedTitle}"`);
    }

    console.log(`\n📅 TEMA DA SEMANA: [${nextCategory.toUpperCase()}]`);

    const modelsToTry = ["gemini-2.0-flash-lite", "gemma-3-27b-it", "gemini-pro-latest"];
    let responseText = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Gerando conteúdo e descrição visual com: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = selectedTitle ? `
                Atue como uma Psicopedagoga Clínica de renome, especialista em desenvolvimento infantil, TEA e TDAH. 
                Seu objetivo é escrever um artigo inédito e de autoridade para o blog da clínica Léia Neves.
                
                O TÍTULO DO ARTIGO É: "${selectedTitle}"
                A CATEGORIA É: "${nextCategory}"

                REGRAS DE OURO:
                1. TOM DE VOZ: Acolhedor, técnico porém simples, e profundamente empático.
                2. ESTRUTURA: Use títulos (h2, h3), listas e uma citação forte (blockquote).
                3. CONTEÚDO: Comece com a dor do pai/mãe, apresente a solução clínica e termine com esperança. Desenvolva o tema com base no título magnético fornecido.
                4. CTA: No final do texto, convide suavemente para uma consulta de avaliação e crie um botão ou link forte direcionando para a Biolink: https://biolink.website/leianeves_psicopedagoga (use o texto "Agendar Conversa no WhatsApp").

                Retorne APENAS um JSON:
                - title: Retorne exatamente o título: "${selectedTitle}"
                - content: Crie um artigo em HTML completo com no mínimo 600 palavras, estruturado para máxima legibilidade, escaneabilidade e experiência do usuário. (Siga a estrutura UX otimizada com div styles, insights, listas, etc.)
                - excerpt: Crie um gancho inicial com 2 frases curtas, impactantes e instigantes.
                - visual_description: Descrição visual para geração de imagem (Realistic photography, etc.)
                - meta_title: Para o Google (máx 60 chars).
                - meta_description: Para o Google (máx 160 chars).
                - category: DEVE SER EXATAMENTE A STRING "${nextCategory}".
            ` : `
                Atue como uma Psicopedagoga Clínica de renome, especialista em desenvolvimento infantil, TEA e TDAH. 
                Seu objetivo é escrever um artigo inédito e de autoridade para o blog da clínica Léia Neves.
                
                O TEMA OBRIGATÓRIO DESTE ARTIGO É: ${nextCategory}
                Crie um título FASCINANTE e TOTALMENTE DIFERENTE dos publicados anteriormente:
                ${allPublishedTitles.slice(0, 10).join('\n')}

                REGRAS DE OURO:
                1. TOM DE VOZ: Acolhedor, técnico porém simples, e profundamente empático.
                2. ESTRUTURA: Use títulos (h2, h3), listas e uma citação forte (blockquote).
                3. CONTEÚDO: Comece com a dor do pai/mãe, apresente a solução clínica e termine com esperança.
                4. CTA: No final do texto, convide suavemente para uma consulta de avaliação e crie um botão ou link forte direcionando para a Biolink: https://biolink.website/leianeves_psicopedagoga (use o texto "Agendar Conversa no WhatsApp").

                Retorne APENAS um JSON:
                - title: Gere um título altamente magnético.
                - content: Crie um artigo em HTML completo com no mínimo 600 palavras.
                - excerpt: Gancho inicial.
                - visual_description: Descrição visual.
                - meta_title: Para o Google.
                - meta_description: Para o Google.
                - category: DEVE SER EXATAMENTE A STRING "${nextCategory}".
            `;

            const result = await currentModel.generateContent(prompt);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) { console.warn(`⚠️ Modelo ${modelName} ocupado.`); }
    }

    if (!responseText) return console.error('❌ Falha na geração.');

    try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());

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

        const { data: postData, error: postError } = await supabase.from('blog_posts').insert([post]).select();
        if (postError) throw postError;

        const newPost = postData[0];
        console.log(`🎉 PUBLICADO: ${newPost.title}`);
        console.log(`🖼️ IMAGEM ÚNICA: ${newPost.image_url}`);

        // --- ASSOCIAÇÃO AO ROTEIRO ---
        try {
            // 1. Buscar ou criar o roteiro para esta categoria
            let { data: roadmap } = await supabase
                .from('blog_roadmaps')
                .select('id')
                .eq('category', nextCategory)
                .single();

            if (!roadmap) {
                console.log(`🛣️ Criando novo roteiro para a categoria: ${nextCategory}`);
                const { data: newRoadmap, error: roadmapError } = await supabase
                    .from('blog_roadmaps')
                    .insert([{
                        title: `Roteiro: ${nextCategory}`,
                        slug: `roteiro-${nextCategory.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`,
                        description: `Aprenda tudo sobre ${nextCategory} nesta trilha de conhecimento estruturada.`,
                        category: nextCategory
                    }])
                    .select()
                    .single();
                
                if (!roadmapError) roadmap = newRoadmap;
            }

            if (roadmap) {
                // 2. Descobrir o próximo índice de ordem
                const { data: items } = await supabase
                    .from('blog_roadmap_items')
                    .select('order_index')
                    .eq('roadmap_id', roadmap.id)
                    .order('order_index', { ascending: false })
                    .limit(1);
                
                const nextOrder = items && items.length > 0 ? items[0].order_index + 1 : 1;

                // 3. Inserir o item no roteiro
                await supabase.from('blog_roadmap_items').insert([{
                    roadmap_id: roadmap.id,
                    post_id: newPost.id,
                    order_index: nextOrder
                }]);
                console.log(`🔗 Associado ao Roteiro: ${nextCategory} (Ordem: ${nextOrder})`);
            }
        } catch (rErr) {
            console.warn('⚠️ Erro ao associar ao roteiro:', rErr.message);
        }

        try {
            const gitCmd = getGitCmd();
            execSync(`${gitCmd} add .`);
            execSync(`${gitCmd} commit -m "Auto-publish: ${newPost.title}"`);
            execSync(`${gitCmd} push`);
            console.log('✅ Tudo sincronizado no GitHub.');
        } catch (sErr) { }
    } catch (e) { console.error('❌ Erro final:', e.message); }
}

runEngine();
