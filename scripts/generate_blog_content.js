
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

// Catálogo curado de fotografias clínicas profissionais em alta resolução (sem marcas d'água)
const categoryCoverImages = {
    'Aprendizagem': [
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Métodos de Ensino': [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Desenvolvimento': [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Emoções': [
        'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Intervenções': [
        'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1584697964190-7052993ab882?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Família & Escola': [
        'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Tecnologia': [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Inclusão': [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Pesquisas': [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Autocuidado': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Motivação': [
        'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Criatividade': [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&h=750&q=85'
    ]
};

function getCuratedCoverImage(category, title) {
    const list = categoryCoverImages[category] || categoryCoverImages['Aprendizagem'];
    const charSum = (title || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return list[charSum % list.length];
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

    const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let responseText = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Gerando conteúdo e descrição visual com: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });
            
            const prompt = selectedTitle ? `
                Atue como uma Psicopedagoga Clínica de renome internacional, autoridade em Neuropsicologia do Desenvolvimento, TEA e TDAH. 
                Seu objetivo é escrever o ARTIGO DEFINITIVO para o blog da clínica Léia Neves.
                
                TÍTULO: "${selectedTitle}"
                CATEGORIA: "${nextCategory}"

                DIRETRIZES DE AUTORIDADE E UX (RELATÓRIO DE OTIMIZAÇÃO):
                1. CONTEÚDO PILAR: Crie um guia profundo. Use listas (bullet points) extensivamente para quebrar blocos de texto.
                2. CTA CONTEXTUAL: Insira um parágrafo curto no meio do texto convidando o leitor a tirar dúvidas via WhatsApp (https://biolink.website/leianeves_psicopedagoga) se identificar esses sinais no filho.
                3. ESCANEABILIDADE: Parágrafos curtos (máx 3 linhas). Negrito em conceitos vitais.
                4. FOCO TEXTUAL: Não inclua tags <img> no HTML do artigo (a imagem oficial de capa já é criada e inserida automaticamente).
                5. TOM: Empático e focado em SOLUÇÕES e ESPERANÇA.

                ELEMENTOS OBRIGATÓRIOS NO HTML:
                - INSIGHT CLÍNICO: Um box <div style="background:#f8fafc; border-left:5px solid #0284c7; padding:20px; margin:30px 0; border-radius:0 12px 12px 0;"> com a neurociência do tema.
                - GUIA PRÁTICO (LISTA): Use <ul> com 5+ itens de ações práticas.

                RETORNE APENAS JSON:
                - title: "${selectedTitle}"
                - content: Artigo em HTML (mínimo 1000 palavras). Use muitas listas e o CTA contextual de meio.
                - excerpt: Gancho emocional de 2 frases.
                - visual_description: Direção de arte 8k (Estilo: Sucesso, Alegria, Conquista no aprendizado).
                - meta_title: Título SEO.
                - meta_description: Descrição magnética.
                - category: "${nextCategory}"
            ` : `
                Atue como uma Psicopedagoga Clínica de renome internacional, autoridade em Neuropsicologia do Desenvolvimento, TEA e TDAH. 
                Seu objetivo é criar um tema inédito e escrever o ARTIGO DEFINITIVO para o blog da clínica Léia Neves.
                
                CATEGORIA: "${nextCategory}"

                DIRETRIZES DE AUTORIDADE E UX:
                1. Crie um Título Inédito, altamente magnético, empático e focado em pais de crianças com dificuldades escolares, TEA ou TDAH.
                2. CONTEÚDO PILAR: Crie um guia profundo (mínimo 1000 palavras em HTML formatado com <h2>, <h3>, <p>, <ul>).
                3. CTA CONTEXTUAL: Insira um parágrafo no meio convidando a entrar em contato via WhatsApp (https://biolink.website/leianeves_psicopedagoga).
                4. INSIGHT CLÍNICO: Um box <div style="background:#f8fafc; border-left:5px solid #0284c7; padding:20px; margin:30px 0; border-radius:0 12px 12px 0;"> com a explicação neurocientífica.
                5. ESCANEABILIDADE: Parágrafos curtos e objetivos.

                RETORNE APENAS JSON:
                - title: "Título Inédito Criado"
                - content: Artigo em HTML.
                - excerpt: Gancho emocional de 2 frases.
                - visual_description: Direção de arte 8k sem texto.
                - meta_title: Título SEO otimizado.
                - meta_description: Descrição magnética.
                - category: "${nextCategory}"
            `;

            const result = await currentModel.generateContent(prompt);
            responseText = result.response.text();
            if (responseText) break;
        } catch (err) { console.warn(`⚠️ Modelo ${modelName} falhou: ${err.message}`); }
    }

    if (!responseText) return console.error('❌ Falha na geração.');

    try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());

        const imageUrl = getCuratedCoverImage(data.category || nextCategory, data.title);
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

    } catch (e) { console.error('❌ Erro final:', e.message); }
}

runEngine();
