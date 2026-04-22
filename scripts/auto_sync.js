
import { execSync } from 'child_process';

async function sync() {
    console.log('🚀 Iniciando Sincronização Automática (Git)...');
    
    const gitPaths = [
        'git',
        'C:\\Program Files\\Git\\bin\\git.exe',
        'C:\\Program Files (x86)\\Git\\bin\\git.exe'
    ];
    
    let gitCmd = 'git';
    for (const p of gitPaths) {
        try {
            execSync(`"${p}" --version`);
            gitCmd = `"${p}"`;
            break;
        } catch (e) {}
    }

    try {
        // 1. Adicionar todos os arquivos
        console.log('📦 Adicionando arquivos...');
        execSync(`${gitCmd} add .`);

        // 2. Commit
        const message = `Auto-update: Blog Engine & Design Improvements ${new Date().toLocaleString()}`;
        console.log(`📝 Criando commit: "${message}"`);
        execSync(`${gitCmd} commit -m "${message}"`);

        // 3. Push
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
