import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

function getGitCmd() {
    const possiblePaths = [
        'git',
        'C:\\Program Files\\Git\\bin\\git.exe',
        'C:\\Program Files\\Git\\cmd\\git.exe',
        'C:\\Program Files (x86)\\Git\\bin\\git.exe',
        'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
        join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'bin', 'git.exe')
    ];
    
    for (const p of possiblePaths) {
        try {
            execSync(`"${p}" --version`, { stdio: 'ignore' });
            return `"${p}"`;
        } catch (e) {}
    }
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
            console.log('ℹ️ Sem mudanças locais para commitar.');
        }

        console.log('🔄 Sincronizando com o GitHub (Pull)...');
        try {
            execSync(`${git} pull origin main --rebase`);
        } catch (e) {
            console.log('⚠️ Aviso: Falha ao sincronizar (pull). Continuando mesmo assim...');
        }
        
        console.log('⬆️ Enviando para o GitHub (Push)...');
        execSync(`${git} push origin main`);
        
        console.log('\n✅ TUDO PRONTO! Os arquivos foram enviados com sucesso.');
        console.log('Agora você pode ir na aba "Actions" do seu GitHub e verá o gerador lá!');
    } catch (error) {
        console.error('\n❌ Erro ao enviar:', error.message);
        console.log('\n💡 Dicas para resolver:');
        console.log('1. Se o erro for de autenticação, abra o GitHub Desktop e clique em "Push origin".');
        console.log('2. Verifique se o OneDrive não está travando os arquivos (ícone azul na barra de tarefas).');
        console.log('3. Tente rodar: git push origin main --force (APENAS se tiver certeza).');
    }
}

run();
