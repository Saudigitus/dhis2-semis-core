const { execSync } = require('child_process');

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
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

    // Proteção para primeiro commit
    let diffOutput = '';
    try {
        diffOutput = execSync('git diff --name-only HEAD^ HEAD').toString();
    } catch {
        process.exit(0);
    }

    const changedFiles = diffOutput.split('\n').map(f => f.replace(/\\/g, '/'));

    console.log(`\n🌿 SEMIS | Sync automático de subtrees`);
    console.log(`🌿 Branch: ${currentBranch}`);

    SUBTREES.forEach(subtree => {
        const hasChanges = changedFiles.some(file => file.startsWith(subtree.folder));

        if (hasChanges) {
            console.log(`🔄 Sincronizando ${subtree.folder}`);

            try {
                execSync(
                    `git subtree push --prefix=${subtree.folder} ${subtree.remote} ${currentBranch}`,
                    { stdio: 'inherit' }
                );
                console.log(`✅ ${subtree.folder} sincronizado`);
            } catch {
                console.log(`⚠️ Falha em ${subtree.folder} (branch existe no remoto?)`);
            }
        }
    });

} catch {
    // silencioso
}
