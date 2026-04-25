
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

    // 1. Definir o ciclo de categorias
    const categoriesCycle = [
        'Aprendizagem', 'Métodos de Ensino', 'Desenvolvimento', 'Emoções',
        'Intervenções', 'Família & Escola', 'Tecnologia', 'Inclusão',
        'Pesquisas', 'Autocuidado', 'Motivação', 'Criatividade'
    ];

    // 2. Descobrir qual foi a última categoria gerada e quais os títulos recentes
    let nextCategory = categoriesCycle[0];
    let recentTitles = [];
    try {
        const { data: lastPosts } = await supabase
            .from('blog_posts')
            .select('title, category')
            .order('created_at', { ascending: false })
            .limit(10);

        if (lastPosts && lastPosts.length > 0) {
            recentTitles = lastPosts.map(p => p.title);
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

    console.log(`\n📅 TEMA DA SEMANA: [${nextCategory.toUpperCase()}]`);
    console.log(`📖 Analisando ${recentTitles.length} títulos recentes para evitar repetição...`);

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

                IMPORTANTE (EVITAR REPETIÇÃO):
                Os últimos artigos publicados foram:
                ${recentTitles.map(t => `- ${t}`).join('\n')}

                Crie um tópico FASCINANTE e TOTALMENTE DIFERENTE dos listados acima, mas que ainda pertença ao tema "${nextCategory}".
                Inove na abordagem, traga novas pesquisas ou dicas práticas inéditas.

                REGRAS DE OURO:
                1. TOM DE VOZ: Acolhedor, técnico porém simples, e profundamente empático.
                2. ESTRUTURA: Use títulos (h2, h3), listas e uma citação forte (blockquote).
                3. CONTEÚDO: Comece com a dor do pai/mãe, apresente a solução clínica e termine com esperança.
                4. CTA: No final do texto, convide suavemente para uma consulta de avaliação e crie um botão ou link forte direcionando para a Biolink: https://biolink.website/leianeves_psicopedagoga (use o texto "Agendar Conversa no WhatsApp").

                Retorne APENAS um JSON:
                - title: Gere um título altamente magnético, emocional e otimizado para SEO dentro do tema atual da rotação semanal. Utilize gatilhos como curiosidade, dor, transformação ou descoberta. Evite títulos genéricos e priorize especificidade, benefício claro e conexão com o público (pais, educadores ou profissionais da área).
                - content:Crie um artigo em HTML completo com no mínimo 600 palavras, estruturado para máxima legibilidade, escaneabilidade e experiência do usuário.\n\nESTRUTURA OBRIGATÓRIA (UX OTIMIZADA):\n\n- Use <h1> para o título principal\n- Use <h2> para seções principais (mínimo 3)\n- Use <h3> para subtópicos quando necessário\n\n- Parágrafos curtos (máximo 3 a 4 linhas)\n- Espaçamento entre blocos (quebra visual clara)\n\nELEMENTOS DE ENGAJAMENTO (OBRIGATÓRIOS):\n\n1. ABERTURA IMPACTANTE:\n- Primeiros 2 parágrafos com conexão emocional\n- Pode usar pergunta retórica\n\n2. CAIXA DE DESTAQUE (INSIGHT):\nUse bloco visual:\n<div style=\"background:#f4f6f8;padding:16px;border-left:4px solid #4CAF50;border-radius:6px;margin:20px 0;\">\n<strong>Insight importante:</strong>\n<p>Texto curto com uma ideia-chave ou quebra de padrão.</p>\n</div>\n\n3. LISTAS ESCANEÁVEIS:\n- Use <ul> ou <ol> sempre que possível\n- Frases curtas e diretas\n\n4. PASSO A PASSO (AÇÃO PRÁTICA):\n<div style=\"background:#fff8e1;padding:16px;border-radius:6px;margin:20px 0;\">\n<strong>Como aplicar na prática:</strong>\n<ul>\n<li>Passo 1</li>\n<li>Passo 2</li>\n<li>Passo 3</li>\n</ul>\n</div>\n\n5. BLOCO DE ALERTA OU ERRO COMUM:\n<div style=\"background:#fdecea;padding:16px;border-left:4px solid #e53935;border-radius:6px;margin:20px 0;\">\n<strong>Evite isso:</strong>\n<p>Erro comum que pais ou educadores cometem.</p>\n</div>\n\n6. FECHAMENTO COM REFLEXÃO:\n- Último parágrafo com impacto emocional\n- Pode incluir chamada para ação leve (reflexão ou mudança de comportamento)\n\nDIRETRIZES DE ESCRITA:\n- Linguagem acessível, mas com autoridade\n- Evitar blocos longos e densos\n- Alternar entre explicação + exemplo + aplicação\n- Inserir micro histórias ou situações reais\n\nOBJETIVO:\nTransformar o artigo em uma experiência agradável de leitura, que prende atenção, facilita entendimento e aumenta tempo de permanência.\n\nRESULTADO ESPERADO:\nConteúdo com aparência profissional, moderno, dinâmico e visualmente organizado — não um bloco de texto cansativo."
                - excerpt: Crie um gancho inicial com 2 frases curtas, impactantes e instigantes, despertando identificação emocional e curiosidade. Deve provocar reflexão imediata ou sensação de urgência. Evite clichês.
                - visual_description: Atue como um Diretor de Arte Sênior especializado em fotografia educacional, documental e humanizada.\n\nA imagem deve ser baseada diretamente no tema da semana e no conteúdo do artigo.\n\nREGRAS DE VARIAÇÃO (OBRIGATÓRIAS):\n- ÂNGULO: Alterne entre macro extremo (detalhes de mãos, olhos, materiais), plano médio (interação humana), plano aberto (ambiente completo), ou vista superior (flat lay).\n- CENÁRIO: Sala de aula inclusiva, consultório psicopedagógico moderno, ambiente doméstico acolhedor, espaço externo (parquinho, jardim), ou mesa de estudo organizada.\n- FOCO PRINCIPAL: Alternar entre crianças, profissional, interação familiar, ou objetos pedagógicos.\n\nDIREÇÃO CRIATIVA POR TEMA:\n- Aprendizagem: foco em descoberta e concentração\n- Métodos de Ensino: interação ativa e prática pedagógica\n- Desenvolvimento: progressão e evolução da criança\n- Emoções: expressão facial e vínculo afetivo\n- Intervenções: ação prática e orientação profissional\n- Família & Escola: conexão entre responsáveis e educadores\n- Tecnologia: uso equilibrado de dispositivos na aprendizagem\n- Inclusão: diversidade real e acessibilidade\n- Pesquisas: ambiente analítico, livros, estudo\n- Autocuidado: pausas, acolhimento, bem-estar\n- Motivação: superação, conquista\n- Criatividade: expressão livre, cores, materiais lúdicos\n\nDIREÇÃO VISUAL AVANÇADA:\n- Definir emoção clara (descoberta, dúvida, conquista, acolhimento).\n- Capturar um momento específico (não poses genéricas).\n- Usar profundidade de campo (bokeh), foco seletivo e composição profissional.\n\nILUMINAÇÃO:\n- Variar entre luz natural suave, luz lateral de janela, iluminação clínica acolhedora, luz dourada de fim de tarde.\n\nTEXTURAS E REALISMO:\n- Incluir materiais reais: papel, madeira, lápis usados, tecidos.\n- Evitar aparência artificial ou estéril.\n\nESTILO FINAL (OBRIGATÓRIO):\nRealistic photography, ultra-detailed, high-end editorial, 8k, cinematic lighting, shallow depth of field, professional color grading, no text, no watermark.\n\nREGRA CRÍTICA:\nNunca repetir composição, cenário ou estilo. Cada imagem deve parecer de um ensaio fotográfico completamente diferente."
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
        } catch (sErr) { }
    } catch (e) { console.error('❌ Erro final:', e.message); }
}

runEngine();
