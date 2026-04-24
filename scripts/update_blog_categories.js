
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
        let newCategory = 'Aprendizagem'; // Default

        const text = (post.title + ' ' + (post.category || '')).toLowerCase();

        // Categorização mais robusta (Prioridade para temas específicos)
        if (text.includes('tecnologia') || text.includes('digital') || text.includes('celular') || text.includes('tablet') || text.includes('conectad')) 
            newCategory = 'Tecnologia';
        else if (text.includes('tea') || text.includes('autismo') || text.includes('inclusão') || text.includes('atípico')) 
            newCategory = 'Inclusão';
        else if (text.includes('tdah') || text.includes('hiperatividade') || text.includes('atenção') || text.includes('foco')) 
            newCategory = 'Desenvolvimento';
        else if (text.includes('família') || text.includes('pais') || text.includes('mãe') || text.includes('pai') || text.includes('escola') || text.includes('casa')) 
            newCategory = 'Família & Escola';
        else if (text.includes('emoção') || text.includes('sentimento') || text.includes('emocional') || text.includes('ansiedade') || text.includes('medo')) 
            newCategory = 'Emoções';
        else if (text.includes('pesquisa') || text.includes('estudo') || text.includes('ciência') || text.includes('científico')) 
            newCategory = 'Pesquisas';
        else if (text.includes('método') || text.includes('ensino') || text.includes('didática') || text.includes('pedagogia')) 
            newCategory = 'Métodos de Ensino';
        else if (text.includes('intervenção') || text.includes('terapia') || text.includes('clínica') || text.includes('sessão')) 
            newCategory = 'Intervenções';
        else if (text.includes('motivação') || text.includes('ânimo') || text.includes('vontade') || text.includes('incentivo')) 
            newCategory = 'Motivação';
        else if (text.includes('criatividade') || text.includes('arte') || text.includes('lúdico') || text.includes('brincar')) 
            newCategory = 'Criatividade';
        else if (text.includes('auto') || text.includes('cuidado') || text.includes('saúde mental') || text.includes('bem-estar')) 
            newCategory = 'Autocuidado';
        else if (text.includes('alfabetização') || text.includes('leitura') || text.includes('escrita') || text.includes('aprender')) 
            newCategory = 'Aprendizagem';

        console.log(`📝 Vinculando "${post.title}" -> ${newCategory}`);

        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ category: newCategory })
            .eq('id', post.id);

        if (updateError) console.error(`❌ Erro no post ${post.id}:`, updateError);
    }

    console.log('✅ Categorias atualizadas com sucesso!');
}

updateCategories();
