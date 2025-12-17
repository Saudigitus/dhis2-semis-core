const { execSync } = require('child_process');

/**
 * Evita loop infinito:
 * git subtree push cria commits internos
 */
if (process.env.SEMIS_SUBTREE_SYNC === '1') {
    process.exit(0);
}

// --- Configuração dos Subtrees ---
const SUBTREES = [
    { folder: 'src/modules/attendance', remote: 'https://github.com/Saudigitus/dhis2-semis-attendance.git' },
    { folder: 'src/modules/enrollment', remote: 'enrollment' },
    { folder: 'src/modules/final-result', remote: 'https://github.com/Saudigitus/dhis2-semis-final-result.git' },
    { folder: 'src/modules/performance', remote: 'https://github.com/Saudigitus/dhis2-semis-performance.git' },
    { folder: 'src/modules/school-calendar', remote: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git' },
    { folder: 'src/modules/transfer', remote: 'https://github.com/Saudigitus/dhis2-semis-transfer.git' },
    { folder: 'src/modules/transfer-execute', remote: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git' }
];

try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch: ${currentBranch}`);

    /**
     * ✅ COMANDO CORRETO PARA HOOKS
     */
    const diffOutput = execSync(
        'git diff-tree --no-commit-id --name-only -r HEAD'
    ).toString();

    const changedFiles = diffOutput
        .split('\n')
        .map(f => f.replace(/\\/g, '/'))
        .filter(Boolean);

    // DEBUG (opcional, podes remover depois)
    // console.log('📄 Ficheiros alterados:', changedFiles);

    SUBTREES.forEach(subtree => {
        const hasChanges = changedFiles.some(file =>
            file.startsWith(`${subtree.folder}/`)
        );

        if (!hasChanges) return;

        console.log(`🔄 Sincronizando ${subtree.folder}`);

        try {
            execSync(
                `bash -c 'git add ${subtree.folder} && git subtree push --prefix=${subtree.folder} ${subtree.remote} ${currentBranch} dummy"`,
                { stdio: 'inherit' }
            );

            console.log(`✅ ${subtree.folder} sincronizado`);
        } catch (err) {
            console.log(
                `⚠️ Falha ao sincronizar ${subtree.folder} (branch '${currentBranch}' existe no remoto?) ${err}`
            );
        }
    });

} catch (err) {
    console.log('⚠️ Erro inesperado no sync de subtrees', err);
}
