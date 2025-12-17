const { execSync } = require('child_process');

// Evita loop infinito do hook
if (process.env.SEMIS_SUBTREE_SYNC === '1') {
    process.exit(0);
}

// --- Configuração dos Subtrees ---
const SUBTREES = [
    {
        folder: 'src/modules/attendance',
        repo: 'https://github.com/Saudigitus/dhis2-semis-attendance.git',
    },
    {
        folder: 'src/modules/enrollment',
        repo: 'https://github.com/Saudigitus/dhis2-semis-enrollment.git',
    },
    {
        folder: 'src/modules/final-result',
        repo: 'https://github.com/Saudigitus/dhis2-semis-final-result.git',
    },
    {
        folder: 'src/modules/performance',
        repo: 'https://github.com/Saudigitus/dhis2-semis-performance.git',
    },
    {
        folder: 'src/modules/school-calendar',
        repo: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git',
    },
    {
        folder: 'src/modules/transfer',
        repo: 'https://github.com/Saudigitus/dhis2-semis-transfer.git',
    },
    {
        folder: 'src/modules/transfer-execute',
        repo: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git',
    },
];

try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();

    console.log('\n🌿 SEMIS | Sync automático de subtrees');
    console.log(`🌿 Branch: ${currentBranch}`);

    // Detecta alterações no último commit, em qualquer subpasta do módulo
    const diffOutput = execSync(
        'git diff-tree --no-commit-id --name-only -r HEAD'
    ).toString();

    const changedFiles = diffOutput
        .split('\n')
        .map(f => f.replace(/\\/g, '/'))
        .filter(Boolean);

    SUBTREES.forEach(subtree => {
        const hasChanges = changedFiles.some(file =>
            file.startsWith(subtree.folder + '/')
        );

        if (!hasChanges) return;

        console.log(`🔄 Sincronizando ${subtree.folder}`);

        try {
            // Windows safe: define variável de ambiente para evitar loop
            execSync(
                `cmd /c "set SEMIS_SUBTREE_SYNC=1 && git subtree push --prefix=${subtree.folder} --squash ${subtree.repo} ${currentBranch}"`,
                { stdio: 'inherit' }
            );

            console.log(`✅ ${subtree.folder} sincronizado`);
        } catch (err) {
            // Trata "no new revisions" como info
            if (err.stdout?.toString().includes('no new revisions') ||
                err.message.includes('no new revisions')) {
                console.log(`ℹ️ ${subtree.folder}: sem alterações novas para enviar`);
            } else {
                console.error(`❌ Falha ao sincronizar ${subtree.folder}`);
                console.error(err.message);
            }
        }
    });

} catch (err) {
    console.error('⚠️ Erro inesperado no sync de subtrees');
    console.error(err);
}
