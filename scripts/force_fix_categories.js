import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Tenta usar a SERVICE ROLE se existir (para ignorar RLS), senão usa a ANON KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const validCategories = [
    'Aprendizagem', 'Métodos de Ensino', 'Desenvolvimento', 'Emoções', 
    'Intervenções', 'Família & Escola', 'Tecnologia', 'Inclusão', 
    'Pesquisas', 'Autocuidado', 'Motivação', 'Criatividade'
];

async function updateAllArticles() {
    console.log('🔄 Varrendo TODOS os artigos no banco de dados...');

    const { data: posts, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, category, excerpt');

    if (fetchError) {
        console.error('❌ Erro ao buscar posts:', fetchError);
        return;
    }

    console.log(`Encontrados ${posts.length} artigos para análise.\n`);

    for (const post of posts) {
        // Se já está numa das 12 categorias exatas, não precisa mudar
        if (post.category && validCategories.includes(post.category)) {
            console.log(`✅ [OK] "${post.title.substring(0,30)}..." já tem categoria válida: ${post.category}`);
            continue;
        }

        const text = (post.title + ' ' + (post.category || '') + ' ' + (post.excerpt || '')).toLowerCase();
        let newCategory = 'Aprendizagem'; // Default

        if (text.includes('tecnologia') || text.includes('digital') || text.includes('celular') || text.includes('tablet') || text.includes('conectad') || text.includes('tela')) 
            newCategory = 'Tecnologia';
        else if (text.includes('tea') || text.includes('autismo') || text.includes('inclusão') || text.includes('atípico') || text.includes('espectro')) 
            newCategory = 'Inclusão';
        else if (text.includes('tdah') || text.includes('hiperatividade') || text.includes('atenção') || text.includes('foco') || text.includes('desenvolvimento')) 
            newCategory = 'Desenvolvimento';
        else if (text.includes('família') || text.includes('pais') || text.includes('mãe') || text.includes('pai') || text.includes('escola') || text.includes('casa')) 
            newCategory = 'Família & Escola';
        else if (text.includes('emoção') || text.includes('sentimento') || text.includes('emocional') || text.includes('ansiedade') || text.includes('medo') || text.includes('angústia')) 
            newCategory = 'Emoções';
        else if (text.includes('pesquisa') || text.includes('estudo') || text.includes('ciência') || text.includes('científico')) 
            newCategory = 'Pesquisas';
        else if (text.includes('método') || text.includes('ensino') || text.includes('didática') || text.includes('pedagogia')) 
            newCategory = 'Métodos de Ensino';
        else if (text.includes('intervenção') || text.includes('terapia') || text.includes('clínica') || text.includes('sessão') || text.includes('psicopedagogia')) 
            newCategory = 'Intervenções';
        else if (text.includes('motivação') || text.includes('ânimo') || text.includes('vontade') || text.includes('incentivo')) 
            newCategory = 'Motivação';
        else if (text.includes('criatividade') || text.includes('arte') || text.includes('lúdico') || text.includes('brincar') || text.includes('jogo')) 
            newCategory = 'Criatividade';
        else if (text.includes('auto') || text.includes('cuidado') || text.includes('saúde mental') || text.includes('bem-estar') || text.includes('rotina')) 
            newCategory = 'Autocuidado';
        else if (text.includes('alfabetização') || text.includes('leitura') || text.includes('escrita') || text.includes('aprender') || text.includes('aprendizado')) 
            newCategory = 'Aprendizagem';

        console.log(`📝 Corrigindo "${post.title.substring(0,30)}..." -> De [${post.category}] para [${newCategory}]`);

        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ category: newCategory })
            .eq('id', post.id);

        if (updateError) {
            console.error(`❌ Falha ao atualizar: ${updateError.message}`);
        }
    }

    console.log('\n🎉 Varredura completa! O banco de dados está limpo e padronizado.');
}

updateAllArticles();
