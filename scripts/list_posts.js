
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listPosts() {
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('title, category');

    if (error) {
        console.error('❌ Erro:', error);
        return;
    }

    console.log('--- LISTA DE POSTS NO BANCO ---');
    posts.forEach(p => {
        console.log(`📌 Título: ${p.title} | Categoria: ${p.category}`);
    });
}

listPosts();
