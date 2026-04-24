import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

function getGitCmd() {
    return 'git';
}

async function run() {
    try {
        const git = getGitCmd();
        console.log(`🚀 Usando Git em: ${git}`);
        
        console.log('📦 Preparando arquivos...');
        execSync(`${git} add .`);
        
        console.log('✍️ Criando commit...');
        try {
            execSync(`${git} commit -m "Configurando automação semanal do blog"`);
        } catch (e) {
            console.log('ℹ️ Sem mudanças pendentes para enviar.');
            return;
        }
        
        console.log('⬆️ Enviando para o GitHub...');
        execSync(`${git} push`);
        
        console.log('\n✅ TUDO PRONTO! Os arquivos foram enviados com sucesso.');
        console.log('Agora você pode ir na aba "Actions" do seu GitHub e verá o gerador lá!');
    } catch (error) {
        console.error('\n❌ Erro ao enviar:', error.message);
        console.log('\n💡 Dica: Se o erro for de autenticação, abra o GitHub Desktop e clique em "Push origin" manualmente.');
    }
}

run();
