#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Evita loop infinito causado por pushes internos do subtree
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
    return runCommand('git log -1 --pretty=%B').trim();
}

function getChangedFiles() {
    // Compara o commit atual (HEAD) com o anterior (HEAD^)
    const output = runCommand('git diff-tree --no-commit-id --name-only -r HEAD^..HEAD');
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
        console.log('ℹ️  Nenhum ficheiro alterado no commit. Nada a sincronizar.');
        process.exit(0);
    }

    // Debug opcional (podes comentar)
    // console.log('📄 Ficheiros alterados neste commit:', changedFiles);

    let hasAnySync = false;

    // Define variável para evitar loop antes dos pushes
    process.env.SEMIS_SUBTREE_SYNC = '1';

    for (const subtree of SUBTREES) {
        const prefix = path.normalize(subtree.folder) + '/';

        const hasChanges = changedFiles.some(file => file.startsWith(prefix));
        if (!hasChanges) continue;

        hasAnySync = true;
        console.log(`🔄 Sincronizando subtree: ${subtree.folder}`);

        const branchExists = remoteHasBranch(subtree.remote, currentBranch);

        const escapedMessage = commitMessage.replace(/"/g, '\\"');
        const pushCommand = `git subtree push --prefix=${subtree.folder} ${subtree.remote} ${currentBranch} --message="${escapedMessage}"`;

        try {
            execSync(pushCommand, { stdio: 'inherit' });
            console.log(`✅ ${subtree.folder} sincronizado com sucesso\n`);
        } catch (error) {
            console.log(`❌ Falha ao sincronizar ${subtree.folder}`);

            if (!branchExists || error.message.includes('no upstream')) {
                console.log(`   💡 A branch '${currentBranch}' ainda não existe no remote.`);
                console.log(`      Cria manualmente uma vez:\n      ${pushCommand.replace('--message="..."', '')}\n`);
            } else {
                console.log(`   Código de erro: ${error.status}\n`);
            }
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
    delete process.env.SEMIS_SUBTREE_SYNC;
}