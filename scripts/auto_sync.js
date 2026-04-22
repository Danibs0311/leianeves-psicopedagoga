
import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

async function sync() {
    console.log('🚀 Iniciando Sincronização Automática (Git)...');
    
    // Tentar encontrar o Git do GitHub Desktop
    let gitCmd = 'git';
    const localAppData = process.env.LOCALAPPDATA;
    const githubDesktopPath = join(localAppData, 'GitHubDesktop');

    const possiblePaths = [
        'git',
        join(githubDesktopPath, 'bin', 'github-git.exe'),
        'C:\\Program Files\\Git\\bin\\git.exe'
    ];

    // Tentar encontrar a pasta app-xxx do GitHub Desktop
    if (existsSync(githubDesktopPath)) {
        const apps = readdirSync(githubDesktopPath).filter(f => f.startsWith('app-'));
        if (apps.length > 0) {
            possiblePaths.push(join(githubDesktopPath, apps[apps.length - 1], 'resources', 'app', 'git', 'cmd', 'git.exe'));
        }
    }

    for (const p of possiblePaths) {
        try {
            execSync(`"${p}" --version`, { stdio: 'ignore' });
            gitCmd = `"${p}"`;
            break;
        } catch (e) {}
    }

    try {
        console.log(`📡 Usando: ${gitCmd}`);
        console.log('📦 Adicionando arquivos...');
        execSync(`${gitCmd} add .`);

        const message = `Auto-update: Blog Engine & Design Improvements ${new Date().toLocaleString()}`;
        console.log(`📝 Criando commit: "${message}"`);
        execSync(`${gitCmd} commit -m "${message}"`);

        console.log('⬆️ Enviando para o repositório remoto (Sync)...');
        execSync(`${gitCmd} push`);

        console.log('✅ Tudo pronto! Seu código está seguro e sincronizado.');
    } catch (error) {
        if (error.stdout && error.stdout.toString().includes('nothing to commit')) {
            console.log('ℹ️ Nenhuma alteração pendente para sincronizar.');
        } else {
            console.error('❌ Erro na sincronização:', error.message);
        }
    }
}

sync();
