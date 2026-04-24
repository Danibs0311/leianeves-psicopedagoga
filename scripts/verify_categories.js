
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function verify() {
    console.log('🔍 Buscando todos os artigos no banco de dados...');
    
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('title, category, is_published');

    if (error) {
        console.error('❌ Erro ao buscar artigos:', error);
        return;
    }

    console.log(`\n📊 Total de artigos encontrados: ${posts.length}`);
    
    const countByCategory = {};
    posts.forEach(p => {
        const cat = p.category || 'SEM CATEGORIA';
        countByCategory[cat] = (countByCategory[cat] || 0) + 1;
    });

    console.log('\n📈 Distribuição por Categoria:');
    Object.entries(countByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`- ${cat}: ${count} artigo(s)`);
    });

    console.log('\n📝 Lista dos 10 primeiros artigos:');
    posts.slice(0, 10).forEach(p => {
        console.log(`[${p.is_published ? 'PUBLICADO' : 'RASCUNHO'}] ${p.category} | ${p.title.substring(0, 50)}...`);
    });
}

verify();
