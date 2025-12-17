#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Evita loop infinito
if (process.env.SEMIS_SUBTREE_SYNC === '1') {
    process.exit(0);
}

const SUBTREES = [
    { folder: 'src/modules/attendance',           remote: 'https://github.com/Saudigitus/dhis2-semis-attendance.git' },
    { folder: 'src/modules/enrollment',           remote: 'enrollment' },
    { folder: 'src/modules/final-result',         remote: 'https://github.com/Saudigitus/dhis2-semis-final-result.git' },
    { folder: 'src/modules/performance',          remote: 'https://github.com/Saudigitus/dhis2-semis-performance.git' },
    { folder: 'src/modules/school-calendar',      remote: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git' },
    { folder: 'src/modules/transfer',             remote: 'https://github.com/Saudigitus/dhis2-semis-transfer.git' },
    { folder: 'src/modules/transfer-execute',     remote: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git' },
];

function runCommand(cmd) {
    return execSync(cmd, { encoding: 'utf8' }).trim();
}

try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    const commitMessage = runCommand('git log -1 --pretty=%B').trim();

    // Pega ficheiros alterados no ÚLTIMO commit
    const changedFiles = runCommand('git diff-tree --no-commit-id --name-only -r HEAD')
        .split('\n')
        .map(f => path.normalize(f.trim())) // Normaliza caminhos (Windows/Linux)
        .filter(Boolean);

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch: ${currentBranch}`);
    console.log(`📝 Mensagem: "${commitMessage || '(vazio)'}"`);
    console.log(`📄 Ficheiros alterados (${changedFiles.length}): ${changedFiles.join(', ')}\n`);

    let hasAnySync = false;
    process.env.SEMIS_SUBTREE_SYNC = '1'; // Ativa proteção contra loop

    for (const subtree of SUBTREES) {
        // Garante barra no final e normaliza
        const prefix = path.normalize(subtree.folder) + path.sep;

        const hasChanges = changedFiles.some(file => file.startsWith(prefix));

        if (!hasChanges) {
            // console.log(`⏭️  Sem alterações em ${subtree.folder}`);
            continue;
        }

        hasAnySync = true;
        console.log(`🔄 Sincronizando ${subtree.folder}...`);

        const escapedMessage = commitMessage.replace(/"/g, '\\"');
        const pushCmd = `git subtree push --prefix="${subtree.folder}" ${subtree.remote} ${currentBranch} --message="${escapedMessage}"`;

        try {
            execSync(pushCmd, { stdio: 'inherit' });
            console.log(`✅ ${subtree.folder} sincronizado com sucesso\n`);
        } catch (error) {
            console.log(`❌ Falha ao sincronizar ${subtree.folder} (código: ${error.status})`);
            if (error.message.includes('no upstream') || error.message.includes('refspec')) {
                console.log(`   💡 Primeira vez? Cria a branch manualmente:\n      ${pushCmd}\n`);
            }
            console.log('');
        }
    }

    if (!hasAnySync) {
        console.log('ℹ️  Nenhum subtree afetado por este commit.\n');
    }

} catch (error) {
    console.error('💥 Erro crítico no sync de subtrees:', error.message || error);
    process.exit(1);
} finally {
    delete process.env.SEMIS_SUBTREE_SYNC;
}