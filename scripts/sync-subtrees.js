const { execSync } = require('child_process');

/**
 * Evita loop infinito:
 * git subtree push cria commits internos
 * que voltam a disparar o hook
 */
if (process.env.SEMIS_SUBTREE_SYNC === '1') {
    process.exit(0);
}

// --- Configuração dos Subtrees ---
const SUBTREES = [
    { folder: 'src/modules/attendance', remote: 'https://github.com/Saudigitus/dhis2-semis-attendance.git' },
    { folder: 'src/modules/enrollment', remote: 'https://github.com/Saudigitus/dhis2-semis-enrollment.git' },
    { folder: 'src/modules/final-result', remote: 'https://github.com/Saudigitus/dhis2-semis-final-result.git' },
    { folder: 'src/modules/performance', remote: 'https://github.com/Saudigitus/dhis2-semis-performance.git' },
    { folder: 'src/modules/school-calendar', remote: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git' },
    { folder: 'src/modules/transfer', remote: 'https://github.com/Saudigitus/dhis2-semis-transfer.git' },
    { folder: 'src/modules/transfer-execute', remote: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git' }
];

try {
    // Branch atual
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch: ${currentBranch}`);

    // Ficheiros alterados no último commit
    let diffOutput = '';
    try {
        diffOutput = execSync('git diff --name-only HEAD^ HEAD').toString();
    } catch {
        // Primeiro commit ou erro → sai silenciosamente
        process.exit(0);
    }

    const changedFiles = diffOutput
        .split('\n')
        .map(f => f.replace(/\\/g, '/'))
        .filter(Boolean);

    // Para cada subtree
    SUBTREES.forEach(subtree => {
        const hasChanges = changedFiles.some(file =>
            file.startsWith(`${subtree.folder}/`)
        );

        if (!hasChanges) return;

        console.log(`🔄 Sincronizando ${subtree.folder}`);

        try {
            /**
             * Windows-safe + cross-platform:
             * cmd /c "set VAR=1 && comando"
             */
            execSync(
                `cmd /c "set SEMIS_SUBTREE_SYNC=1 && git subtree push --prefix=${subtree.folder} ${subtree.remote} ${currentBranch}"`,
                { stdio: 'inherit' }
            );

            console.log(`✅ ${subtree.folder} sincronizado`);
        } catch (err) {
            console.log(
                `⚠️ Falha ao sincronizar ${subtree.folder} (branch '${currentBranch}' existe no remoto?)`
            );
        }
    });

} catch {
    // Silencioso para não quebrar o commit
}
