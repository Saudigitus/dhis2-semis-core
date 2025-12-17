#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Evita loop infinito
if (process.env.SEMIS_SUBTREE_SYNC === '1') {
    process.exit(0);
}

// ----------------------------- Configuração -----------------------------
const SUBTREES = [
    { folder: 'src/modules/attendance',           remote: 'https://github.com/Saudigitus/dhis2-semis-attendance.git' },
    { folder: 'src/modules/enrollment',           remote: 'enrollment' },
    { folder: 'src/modules/final-result',         remote: 'https://github.com/Saudigitus/dhis2-semis-final-result.git' },
    { folder: 'src/modules/performance',          remote: 'https://github.com/Saudigitus/dhis2-semis-performance.git' },
    { folder: 'src/modules/school-calendar',      remote: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git' },
    { folder: 'src/modules/transfer',             remote: 'https://github.com/Saudigitus/dhis2-semis-transfer.git' },
    { folder: 'src/modules/transfer-execute',     remote: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git' },
];

// ----------------------------- Funções auxiliares -----------------------------
function runCommand(command, options = {}) {
    try {
        return execSync(command, { encoding: 'utf8', ...options });
    } catch (error) {
        throw error;
    }
}

function getCurrentBranch() {
    return runCommand('git rev-parse --abbrev-ref HEAD').trim();
}

function getCommitMessage() {
    // Pega a mensagem completa do último commit (HEAD)
    return runCommand('git log -1 --pretty=%B').trim();
}

function getChangedFiles() {
    const output = runCommand('git diff-tree --no-commit-id --name-only -r HEAD');
    return output
        .split('\n')
        .map(file => file.replace(/\\/g, '/'))
        .filter(Boolean);
}

function remoteHasBranch(remoteNameOrUrl, branch) {
    let remoteUrl;
    try {
        remoteUrl = runCommand(`git config --get remote.${remoteNameOrUrl}.url`).trim();
    } catch {
        remoteUrl = remoteNameOrUrl;
    }

    try {
        runCommand(`git ls-remote --exit-code --heads ${remoteUrl} ${branch}`);
        return true;
    } catch {
        return false;
    }
}

// ----------------------------- Execução principal -----------------------------
try {
    const currentBranch = getCurrentBranch();
    const commitMessage = getCommitMessage();
    const changedFiles = getChangedFiles();

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch atual: ${currentBranch}`);
    console.log(`📝 Mensagem do commit: "${commitMessage || '(vazio)'}"\n`);

    if (changedFiles.length === 0) {
        console.log('ℹ️  Nenhum ficheiro alterado. Nada a sincronizar.');
        process.exit(0);
    }

    let hasAnySync = false;

    // Define a variável para evitar loops antes de qualquer push
    process.env.SEMIS_SUBTREE_SYNC = '1';

    for (const subtree of SUBTREES) {
        const prefix = path.normalize(subtree.folder) + '/';

        const hasChanges = changedFiles.some(file => file.startsWith(prefix));
        if (!hasChanges) continue;

        hasAnySync = true;
        console.log(`🔄 Sincronizando subtree: ${subtree.folder}`);

        // Se a branch ainda não existe no remoto, vamos criar com a mensagem correta
        const branchExists = remoteHasBranch(subtree.remote, currentBranch);

        const pushCommand = [
            'git subtree push',
            `--prefix=${subtree.folder}`,
            subtree.remote,
            currentBranch,
            // Força a reutilização da mensagem do commit original
            `--message="${commitMessage.replace(/"/g, '\\"')}"`
        ].join(' ');

        try {
            execSync(pushCommand, { stdio: 'inherit' });
            console.log(`✅ ${subtree.folder} sincronizado com a mesma mensagem de commit\n`);
        } catch (error) {
            console.log(`❌ Falha ao sincronizar ${subtree.folder}`);

            if (error.message.includes('no upstream configured') || !branchExists) {
                console.log(`   💡 Dica: A branch '${currentBranch}' ainda não existe no módulo.`);
                console.log(`      Execute manualmente uma vez para criar:\n`);
                console.log(`      git subtree push --prefix=${subtree.folder} ${subtree.remote} ${currentBranch}\n`);
            } else {
                console.log(`   Código de erro: ${error.status}`);
            }
            console.log(''); // linha em branco
        }
    }

    if (!hasAnySync) {
        console.log('ℹ️  Nenhum subtree com alterações detectadas.');
    }

} catch (error) {
    console.error('💥 Erro inesperado durante o sync de subtrees:');
    console.error(error.message || error);
    process.exit(1);
} finally {
    // Sempre limpa a variável de ambiente
    delete process.env.SEMIS_SUBTREE_SYNC;
}