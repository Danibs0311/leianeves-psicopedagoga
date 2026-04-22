
import { execSync } from 'child_process';

async function sync() {
    console.log('🚀 Iniciando Sincronização Automática (Git)...');
    
    try {
        // 1. Adicionar todos os arquivos
        console.log('📦 Adicionando arquivos...');
        execSync('git add .');

        // 2. Commit
        const message = `Auto-update: Blog Engine & Design Improvements ${new Date().toLocaleString()}`;
        console.log(`📝 Criando commit: "${message}"`);
        execSync(`git commit -m "${message}"`);

        // 3. Push
        console.log('⬆️ Enviando para o repositório remoto (Sync)...');
        execSync('git push');

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
