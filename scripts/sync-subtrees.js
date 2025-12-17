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

    // Pega ficheiros alterados no último commit
    const changedFiles = runCommand('git diff-tree --no-commit-id --name-only -r HEAD')
        .split('\n')
        .map(f => path.normalize(f.trim()))
        .filter(Boolean);

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch: ${currentBranch}`);
    console.log(`📄 Ficheiros alterados (${changedFiles.length}): ${changedFiles.join(', ')}\n`);

    if (changedFiles.length === 0) {
        console.log('ℹ️  Nenhum ficheiro alterado. Nada a sincronizar.\n');
        process.exit(0);
    }

    let hasAnySync = false;
    process.env.SEMIS_SUBTREE_SYNC = '1'; // Protege contra loop

    for (const subtree of SUBTREES) {
        const prefix = path.normalize(subtree.folder) + path.sep;

        const hasChanges = changedFiles.some(file => file.startsWith(prefix));
        if (!hasChanges) continue;

        hasAnySync = true;
        console.log(`🔄 Sincronizando ${subtree.folder}...`);

        // Comando correto sem --message
        const pushCmd = `git subtree push --prefix="${subtree.folder}" ${subtree.remote} ${currentBranch}`;

        try {
            execSync(pushCmd, { stdio: 'inherit' });
            console.log(`✅ ${subtree.folder} sincronizado com sucesso\n`);
        } catch (error) {
            console.log(`❌ Falha ao sincronizar ${subtree.folder} (código: ${error.status})`);

            // Dica útil para primeira sincronização da branch
            if (error.status === 128 && error.message.includes('fatal: refspec')) {
                console.log(`   💡 Provavelmente a branch '${currentBranch}' ainda não existe no módulo.`);
                console.log(`      Executa manualmente uma vez:\n      ${pushCmd}\n`);
            }
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