#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Evita loop infinito
if (process.env.SEMIS_SUBTREE_SYNC === '1') {
    process.exit(0);
}

const SUBTREES = [
    { folder: 'src/modules/attendance',           remote: 'https://github.com/Saudigitus/dhis2-semis-attendance.git' },
    { folder: 'src/modules/enrollment',           remote: 'enrollment' }, // vai tentar resolver como remote ou usar como URL se falhar
    { folder: 'src/modules/final-result',         remote: 'https://github.com/Saudigitus/dhis2-semis-final-result.git' },
    { folder: 'src/modules/performance',          remote: 'https://github.com/Saudigitus/dhis2-semis-performance.git' },
    { folder: 'src/modules/school-calendar',      remote: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git' },
    { folder: 'src/modules/transfer',             remote: 'https://github.com/Saudigitus/dhis2-semis-transfer.git' },
    { folder: 'src/modules/transfer-execute',     remote: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git' },
];

function runCommand(cmd) {
    return execSync(cmd, { encoding: 'utf8' }).trim();
}

// Resolve remote: se for nome, pega a URL; se não, usa como está (URL direta)
function resolveRemote(remoteArg) {
    try {
        return runCommand(`git config --get remote.${remoteArg}.url`);
    } catch {
        // Se não for remote configurado, assume que é URL direta
        return remoteArg;
    }
}

try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');

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
    process.env.SEMIS_SUBTREE_SYNC = '1';

    for (const subtree of SUBTREES) {
        const prefix = path.normalize(subtree.folder) + path.sep;

        const hasChanges = changedFiles.some(file => file.startsWith(prefix));
        if (!hasChanges) continue;

        hasAnySync = true;
        console.log(`🔄 Sincronizando ${subtree.folder}...`);

        const remoteUrl = resolveRemote(subtree.remote);

        const pushCmd = `git subtree push --prefix="${subtree.folder}" ${remoteUrl} ${currentBranch}`;

        try {
            execSync(pushCmd, { stdio: 'inherit' });
            console.log(`✅ ${subtree.folder} sincronizado com sucesso\n`);
        } catch (error) {
            console.log(`❌ Falha ao sincronizar ${subtree.folder} (código: ${error.status})`);

            if (error.status === 128) {
                console.log(`   💡 Possíveis causas:`);
                console.log(`      - Remote '${subtree.remote}' não configurado corretamente.`);
                console.log(`      - Branch '${currentBranch}' ainda não existe no módulo remoto.`);
                console.log(`      - Problemas de autenticação (SSH/HTTPS).`);
                console.log(`\n      Comando manual sugerido:\n      ${pushCmd}\n`);
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