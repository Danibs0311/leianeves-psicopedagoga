
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const newCategories = [
    'Aprendizagem', 'Métodos de Ensino', 'Desenvolvimento', 'Emoções', 
    'Intervenções', 'Família & Escola', 'Tecnologia', 'Inclusão', 
    'Pesquisas', 'Autocuidado', 'Motivação', 'Criatividade'
];

async function updateCategories() {
    console.log('🔄 Atualizando categorias dos artigos...');

    const { data: posts, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, category');

    if (fetchError) {
        console.error('❌ Erro ao buscar posts:', fetchError);
        return;
    }

    for (const post of posts) {
        // Simple mapping logic based on keywords
        let newCategory = 'Aprendizagem'; // default

        const text = (post.title + ' ' + (post.category || '')).toLowerCase();

        if (text.includes('tea') || text.includes('autismo') || text.includes('inclusão')) newCategory = 'Inclusão';
        else if (text.includes('tdah') || text.includes('desenvolvimento')) newCategory = 'Desenvolvimento';
        else if (text.includes('família') || text.includes('pais') || text.includes('escola')) newCategory = 'Família & Escola';
        else if (text.includes('emoção') || text.includes('sentimento')) newCategory = 'Emoções';
        else if (text.includes('tecnologia') || text.includes('digital')) newCategory = 'Tecnologia';
        else if (text.includes('pesquisa') || text.includes('estudo')) newCategory = 'Pesquisas';
        else if (text.includes('método') || text.includes('ensino')) newCategory = 'Métodos de Ensino';
        else if (text.includes('intervenção')) newCategory = 'Intervenções';
        else if (text.includes('motivação') || text.includes('ânimo')) newCategory = 'Motivação';
        else if (text.includes('criatividade') || text.includes('arte')) newCategory = 'Criatividade';
        else if (text.includes('auto') || text.includes('cuidado')) newCategory = 'Autocuidado';

        console.log(`📝 Atualizando "${post.title}" para categoria: ${newCategory}`);

        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ category: newCategory })
            .eq('id', post.id);

        if (updateError) console.error(`❌ Erro ao atualizar post ${post.id}:`, updateError);
    }

    console.log('✅ Categorias atualizadas com sucesso!');
}

updateCategories();
