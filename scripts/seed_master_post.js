
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function seedMasterPost() {
    console.log('🌟 Semeando Artigo de Autoridade Máxima...');

    const post = {
        title: "Sinais de TEA: Guia Definitivo e Acolhedor para Pais e Cuidadores em 2026",
        slug: "sinais-de-tea-guia-definitivo-2026-" + Date.now(),
        excerpt: "Descubra como identificar os sinais precoces do Autismo com um olhar clínico e humano. Um guia completo para apoiar o desenvolvimento do seu filho.",
        content: `
            <h2>Um Olhar de Esperança e Compreensão</h2>
            <p>Receber a notícia ou mesmo a suspeita de que seu filho pode estar no espectro autista é um momento de profunda introspecção e, muitas vezes, de medo. No entanto, o conhecimento é a ferramenta mais poderosa que um pai ou mãe pode ter. Em 2026, avançamos muito na compreensão do TEA (Transtorno do Espectro Autista), e hoje sabemos que a intervenção precoce é a chave para transformar desafios em superações.</p>
            
            <blockquote>"O diagnóstico não define o potencial do seu filho; ele apenas ilumina o caminho que precisamos percorrer juntos."</blockquote>

            <h2>Principais Sinais para Observar</h2>
            <p>Embora cada criança seja única, existem marcos do desenvolvimento que servem como bússola:</p>
            <ul>
                <li><strong>Comunicação Não-Verbal:</strong> Dificuldade em manter contato visual sustentado ou em usar gestos para pedir algo.</li>
                <li><strong>Interação Social:</strong> Preferência por brincar sozinho ou dificuldade em compartilhar interesses com outras crianças.</li>
                <li><strong>Padrões Repetitivos:</strong> Movimentos como balançar as mãos (flapping) ou um interesse muito intenso e específico por determinados objetos.</li>
                <li><strong>Sensibilidade Sensorial:</strong> Reações intensas a sons, luzes ou texturas específicas de roupas ou alimentos.</li>
            </ul>

            <h2>O Papel da Psicopedagogia</h2>
            <p>A psicopedagogia clínica atua na ponte entre o aprender e o sentir. Através de trilhas terapêuticas personalizadas, ajudamos a criança a desenvolver estratégias de comunicação e socialização que respeitam o seu tempo e o seu jeito de ser.</p>

            <h3>Como Ajudar na Prática?</h3>
            <p>Crie rotinas visuais, use uma linguagem clara e, acima de tudo, celebre cada pequena vitória. O desenvolvimento não é uma corrida, mas uma jornada de descobertas.</p>
        `,
        image_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200",
        category: "Saúde e Família",
        is_published: true,
        published_at: new Date().toISOString(),
        meta_title: "Guia de Sinais de TEA 2026 | Léia Neves Psicopedagoga",
        meta_description: "Aprenda a identificar os sinais de autismo e como buscar ajuda especializada para o desenvolvimento do seu filho."
    };

    const { error } = await supabase.from('blog_posts').insert([post]);
    if (error) console.error('❌ Erro:', error);
    else console.log('✅ Artigo Magistral publicado no banco de dados!');
}

seedMasterPost();
