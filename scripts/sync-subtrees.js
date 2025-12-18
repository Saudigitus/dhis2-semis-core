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
    { folder: 'src/modules/enrollment',           remote: 'https://github.com/Saudigitus/dhis2-semis-enrollment.git' },
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

    const changedFiles = runCommand('git diff-tree --no-commit-id --name-only -r HEAD')
        .split('\n')
        .map(f => path.normalize(f.trim()))
        .filter(Boolean);

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch atual: ${currentBranch}`);
    console.log(`📄 Ficheiros alterados (${changedFiles.length}): ${changedFiles.join(', ')}\n`);

    if (changedFiles.length === 0) {
        console.log('ℹ️  Nenhum ficheiro alterado.\n');
        process.exit(0);
    }

    let hasAnyAttempt = false;
    process.env.SEMIS_SUBTREE_SYNC = '1';

    for (const subtree of SUBTREES) {
        const prefix = path.normalize(subtree.folder) + path.sep;
        const hasChanges = changedFiles.some(file => file.startsWith(prefix));
        if (!hasChanges) continue;

        hasAnyAttempt = true;
        console.log(`🔄 Sincronizando ${subtree.folder}...`);

        const baseCmd = `git subtree push --prefix="${subtree.folder}" ${subtree.remote} ${currentBranch}`;
        let synced = false;
        let lastError = null;

        // 1ª tentativa: com --rejoin
        try {
            execSync(baseCmd + ' --rejoin', { stdio: 'inherit' });
            console.log(`✅ ${subtree.folder} sincronizado com sucesso (com --rejoin)\n`);
            synced = true;
        } catch (error) {
            lastError = error;
            if (error.message.includes('no new revisions were found')) {
                // 2ª tentativa: com --ignore-joins
                console.log(`   ⚙️  --rejoin não detetou alterações. Tentando com --ignore-joins...`);
                try {
                    execSync(baseCmd + ' --ignore-joins', { stdio: 'inherit' });
                    console.log(`✅ ${subtree.folder} sincronizado com sucesso (com --ignore-joins)\n`);
                    synced = true;
                } catch (innerError) {
                    lastError = innerError;
                    console.log(`❌ Falha mesmo com --ignore-joins em ${subtree.folder}`);
                    console.log(`   💡 Executa manualmente para investigar:\n`);
                    console.log(`      ${baseCmd} --rejoin\n`);
                    console.log(`   ou\n`);
                    console.log(`      ${baseCmd} --ignore-joins\n\n`);
                }
            } else {
                console.log(`❌ Erro inesperado ao sincronizar ${subtree.folder}`);
                console.log(`   Comando: ${baseCmd} --rejoin\n`);
            }
        }

        if (!synced && lastError && !lastError.message.includes('no new revisions')) {
            console.log(`   Detalhes do erro: ${lastError.message}\n`);
        }
    }

    if (!hasAnyAttempt) {
        console.log('ℹ️  Nenhum subtree afetado por este commit.\n');
    }

} catch (error) {
    console.error('💥 Erro crítico no script de sync:', error.message || error);
    process.exit(1);
} finally {
    delete process.env.SEMIS_SUBTREE_SYNC;
}