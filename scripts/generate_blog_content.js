
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
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

const blogPostSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING, description: "Título do artigo" },
        content: { type: SchemaType.STRING, description: "Artigo completo em HTML sem tags de imagem" },
        excerpt: { type: SchemaType.STRING, description: "Resumo emocional curto de 2 frases" },
        meta_title: { type: SchemaType.STRING, description: "Título SEO otimizado" },
        meta_description: { type: SchemaType.STRING, description: "Meta description para buscadores" },
        category: { type: SchemaType.STRING, description: "Categoria do artigo" }
    },
    required: ["title", "content", "excerpt", "meta_title", "meta_description", "category"]
};

// Catálogo curado e verificado de fotografias clínicas profissionais em alta resolução (sem marcas d'água)
const categoryCoverImages = {
    'Aprendizagem': [
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Métodos de Ensino': [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Desenvolvimento': [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1500995617113-cf789362a3e1?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Emoções': [
        'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Intervenções': [
        'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Família & Escola': [
        'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Tecnologia': [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Inclusão': [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Pesquisas': [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Autocuidado': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Motivação': [
        'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1200&h=750&q=85'
    ],
    'Criatividade': [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&h=750&q=85',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=1200&h=750&q=85'
    ]
};

async function getUniqueCuratedCoverImage(supabaseClient, category, title) {
    try {
        // 1. Carregar todas as URLs de imagens atualmente cadastradas no banco
        const { data: existingPosts, error } = await supabaseClient
            .from('blog_posts')
            .select('image_url');
        
        if (error) console.warn('⚠️ Aviso ao checar imagens existentes:', error.message);

        // Extrai a base da URL (sem query params) para comparação estrita
        const getBase = (url) => (url || '').split('?')[0].trim();
        const usedUrls = new Set(
            (existingPosts || [])
                .map(p => getBase(p.image_url))
                .filter(Boolean)
        );

        // 2. Tentar imagem não usada da categoria específica
        const categoryList = categoryCoverImages[category] || categoryCoverImages['Aprendizagem'] || [];
        const availableInCategory = categoryList.filter(url => !usedUrls.has(getBase(url)));

        if (availableInCategory.length > 0) {
            const charSum = (title || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            return availableInCategory[charSum % availableInCategory.length];
        }

        // 3. Se todas as imagens da categoria já foram usadas, busca imagem inédita em qualquer categoria
        const allCatalogImages = Object.values(categoryCoverImages).flat();
        const availableGlobal = allCatalogImages.filter(url => !usedUrls.has(getBase(url)));

        if (availableGlobal.length > 0) {
            const charSum = (title || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            return availableGlobal[charSum % availableGlobal.length];
        }

        // 4. Caso mais de 60 posts sejam gerados e todo o catálogo consumido:
        // Seleciona do catálogo com timestamp exclusivo de diferenciação
        const all = Object.values(categoryCoverImages).flat();
        const charSum = (title || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return `${all[charSum % all.length]}&post_seed=${Date.now()}`;
    } catch (err) {
        console.error('Erro ao selecionar imagem única:', err);
        const list = categoryCoverImages[category] || categoryCoverImages['Aprendizagem'];
        return list[0];
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

    const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let responseText = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Gerando conteúdo e descrição visual com: ${modelName}...`);
            const currentModel = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: blogPostSchema
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
                3. ESCANEABILIDADE: Parágrafos curtos (máx 3 linhas). Para destacar conceitos importantes, use OBRIGATORIAMENTE a tag HTML <strong>palavra</strong>. NUNCA use asteriscos duplos (**) de sintaxe markdown.
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
                5. ESCANEABILIDADE: Parágrafos curtos e objetivos. Use OBRIGATORIAMENTE tags HTML <strong>texto</strong> para negrito, NUNCA asteriscos duplos (**).

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
        } catch (err) { 
            console.warn(`⚠️ Modelo ${modelName} falhou: ${err.message}`); 
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    if (!responseText) return console.error('❌ Falha na geração.');

    try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());

        const imageUrl = await getUniqueCuratedCoverImage(supabase, data.category || nextCategory, data.title);
        const slug = data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();

        // Higienizar e converter qualquer resíduo de markdown (**texto**) para HTML (<strong>texto</strong>)
        const cleanContent = (data.content || '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>');

        const post = {
            title: data.title,
            slug,
            content: cleanContent,
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
