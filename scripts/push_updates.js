import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

function getGitCmd() {
    const localAppData = process.env.LOCALAPPDATA;
    const githubDesktopPath = join(localAppData, 'GitHubDesktop');
    const possiblePaths = ['git', join(githubDesktopPath, 'bin', 'github-git.exe'), 'C:\\Program Files\\Git\\bin\\git.exe'];
    
    if (existsSync(githubDesktopPath)) {
        try {
            const apps = readdirSync(githubDesktopPath).filter(f => f.startsWith('app-'));
            if (apps.length > 0) {
                possiblePaths.push(join(githubDesktopPath, apps[apps.length - 1], 'resources', 'app', 'git', 'cmd', 'git.exe'));
            }
        } catch (e) {}
    }

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
