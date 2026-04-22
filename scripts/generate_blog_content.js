
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Configuração de ambiente
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

// BASE DE CONHECIMENTO ATUALIZADA (ATÉ ABRIL 2026)
const knowledgeBase = {
    region: "Cajazeiras, Salvador - Bahia",
    expert: "Léia Neves (Psicopedagoga Especializada em TEA e TDAH)",
    laws_2026: [
        "Lei Federal 15.256/2025: Incentivo ao diagnóstico de TEA em todas as fases da vida, reduzindo o subdiagnóstico em adultos.",
        "Lei Municipal 9.915/2025 (Salvador): Prioridade de matrícula para alunos com TEA na escola mais próxima de sua residência ou trabalho dos pais.",
        "Lei Estadual 14.661/2024 (Bahia): Cinema Amigo do Autista, com sessões adaptadas e luz/som reduzidos.",
        "Estatuto da Pessoa com Deficiência (Lei 13.146/2015) e Lei Berenice Piana (12.764/2012) como bases fundamentais."
    ],
    pain_points: [
        "Exaustão parental e falta de rede de apoio em Salvador",
        "Dificuldades de inclusão escolar efetiva em Cajazeiras",
        "Seletividade alimentar e regulação emocional",
        "Custo e acesso a terapias multidisciplinares"
    ]
};

async function generateAutomatedPost() {
    console.log('🤖 Iniciando Motor de IA (Versão Autoridade 2026)...');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemPrompt = `
        Você é Léia Neves, uma Psicopedagoga experiente e acolhedora de Salvador, Bahia.
        Seu objetivo é escrever um artigo para o blog do seu site clínico.
        
        DIRETRIZES DE ESTILO:
        1. TOM: Informativo, porém extremamente acolhedor e esclarecedor. Use uma linguagem que pais e cuidadores entendam, mas mantenha a autoridade clínica.
        2. FOCO: Transtornos do desenvolvimento, principalmente TEA (Autismo) e TDAH.
        3. LOCALIZAÇÃO: Mencione o bairro de Cajazeiras ou a cidade de Salvador de forma natural, mostrando que o atendimento é local.
        4. LEGISLAÇÃO: Inclua menções às leis atualizadas até Abril de 2026 (Ex: Lei Municipal 9.915/2025 de Salvador sobre prioridade de matrícula).
        5. ESTRUTURA: Use tags HTML como <h2>, <p> e <ul>.
        
        CONTEÚDO DO SITE:
        - Foco em autonomia infantil.
        - Trilhas terapêuticas personalizadas.
        - Acolhimento familiar.

        TEMA DO DIA (Escolha um ou gere um baseado nas dores dos pais):
        - Manejo de crises de TEA em locais públicos de Salvador.
        - TDAH e os desafios da alfabetização na rede escolar de Cajazeiras.
        - Direitos dos pais de crianças atípicas: O que mudou até 2026.
        - Seletividade alimentar: Como tornar as refeições mais leves.

        SAÍDA ESPERADA (JSON):
        {
            "title": "Título atraente e SEO-friendly",
            "content": "Conteúdo HTML completo",
            "excerpt": "Resumo curto para redes sociais",
            "meta_title": "Título SEO com região",
            "meta_description": "Descrição SEO com palavras-chave",
            "category": "TEA / TDAH / Legislação / Parentalidade"
        }
    `;

    try {
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();
        
        // Limpar possíveis Markdown do JSON
        const jsonStr = responseText.replace(/```json|```/g, '').trim();
        const generatedData = JSON.parse(jsonStr);

        const slug = generatedData.title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const finalPost = {
            ...generatedData,
            slug,
            image_url: "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000", // Placeholder de qualidade
            is_published: true,
            published_at: new Date().toISOString(),
            target_region: "Cajazeiras, Salvador - BA"
        };

        console.log(`✨ Artigo Gerado: ${finalPost.title}`);

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([finalPost])
            .select();

        if (error) throw error;

        console.log('✅ Post publicado com sucesso no Blog!');
        console.log(`🔗 Link: /blog/${finalPost.slug}`);

    } catch (err) {
        console.error('❌ Erro no processo:', err);
    }
}

generateAutomatedPost();
