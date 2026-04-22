
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis do .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Idealmente usar Service Role Key para automação
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error('❌ Faltam variáveis de ambiente (Supabase ou Gemini)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Temas Sugeridos para Cajazeiras, Salvador - BA
const topics = [
    "Dificuldades de aprendizagem em crianças: Como identificar?",
    "A importância do diagnóstico precoce de TDAH",
    "Psicopedagogia em Cajazeiras: Onde encontrar apoio?",
    "Como ajudar seu filho na lição de casa sem estresse",
    "Autismo e inclusão escolar em Salvador",
    "Sinais de ansiedade infantil: O que observar?"
];

async function generatePost() {
    console.log('🚀 Iniciando geração de conteúdo com IA...');

    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    // Aqui iríamos chamar a API do Gemini
    // Por enquanto, vou simular a resposta para que você veja a estrutura funcionando.
    // Em produção, usaríamos: const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    const slug = topic.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const postData = {
        title: topic,
        slug: `${slug}-${Date.now()}`,
        content: `
            <p>Este é um artigo gerado automaticamente sobre <strong>${topic}</strong>.</p>
            <p>Se você mora em <strong>Cajazeiras, Salvador</strong>, sabe como é importante ter acesso a profissionais de saúde mental infantil de qualidade perto de casa...</p>
            <h2>Por que buscar ajuda em Cajazeiras?</h2>
            <p>O bairro de Cajazeiras é um dos maiores de Salvador e conta com uma rede de apoio crescente...</p>
            <p>A psicopedagogia atua diretamente na investigação de como a criança aprende...</p>
        `,
        excerpt: `Saiba mais sobre ${topic} e como encontrar apoio especializado no bairro de Cajazeiras, Salvador.`,
        meta_title: `${topic} | Psicopedagoga em Cajazeiras, Salvador`,
        meta_description: `Artigo completo sobre ${topic}. Especialista em psicopedagogia atendendo a região de Cajazeiras, Salvador - BA.`,
        is_published: true,
        published_at: new Date().toISOString(),
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000', // Placeholder
        target_region: 'Cajazeiras, Salvador - BA'
    };

    console.log(`📝 Inserindo post: ${postData.title}`);

    const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select();

    if (error) {
        console.error('❌ Erro ao salvar post:', error.message);
    } else {
        console.log('✅ Blog Post criado com sucesso!');
        console.log('URL Sugerida: /blog/' + postData.slug);
    }
}

generatePost();
