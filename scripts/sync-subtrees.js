const { execSync } = require('child_process');

if (process.env.SEMIS_SUBTREE_SYNC === '1') {
  process.exit(0);
}

const SUBTREES = [
  { folder: 'src/modules/attendance', repo: 'https://github.com/Saudigitus/dhis2-semis-attendance.git' },
  { folder: 'src/modules/enrollment', repo: 'https://github.com/Saudigitus/dhis2-semis-enrollment.git' },
  { folder: 'src/modules/final-result', repo: 'https://github.com/Saudigitus/dhis2-semis-final-result.git' },
  { folder: 'src/modules/performance', repo: 'https://github.com/Saudigitus/dhis2-semis-performance.git' },
  { folder: 'src/modules/school-calendar', repo: 'https://github.com/Saudigitus/dhis2-semis-school-calendar.git' },
  { folder: 'src/modules/transfer', repo: 'https://github.com/Saudigitus/dhis2-semis-transfer.git' },
  { folder: 'src/modules/transfer-execute', repo: 'https://github.com/Saudigitus/dhis2-semis-transfer-execute.git' },
];

function runCommand(cmd, options = {}) {
  // Always use shell so env works cross-platform
  return execSync(cmd, { shell: true, encoding: 'utf8', ...options });
}

function tryPushSubtree(folder, repo, branch) {
  const env = { ...process.env, SEMIS_SUBTREE_SYNC: '1' };

  // 1) Tenta git subtree push normalmente (captura saída)
  try {
    console.log(`git push using: ${repo} ${branch}`);
    const out = runCommand(`git subtree push --prefix=${folder} ${repo} ${branch} dummy`, { env });
    // se chegar aqui, push foi exitoso
    process.stdout.write(out || '');
    console.log(`✅ ${folder} sincronizado (push padrão)`);
    return true;
  } catch (err) {
    // err pode ser uma Error com message; quando usamos encoding: 'utf8' podemos tentar extrair stderr/stdout
    const errText = (err.stdout || '') + (err.stderr || '') + (err.message || '');

    // 2) Se for "no new revisions" -> não é erro
    if (/no new revisions/i.test(errText)) {
      console.log(`ℹ️ ${folder}: sem alterações novas para enviar`);
      return true; // considerado OK
    }

    console.log(`⚠️ git subtree push falhou para ${folder}: tentativa de fallback (split+push).`);
    // continua para o fallback
  }

  // 3) Fallback: cria split e empurra o SHA directamente para a branch remota
  try {
    const splitCmd = `git subtree split --prefix=${folder} HEAD`;
    const splitSha = runCommand(splitCmd, { env: process.env }).toString().trim();

    if (!splitSha) {
      console.error(`❌ Não foi possível gerar split para ${folder} (split vazio).`);
      return false;
    }

    console.log(`🔧 Split criado: ${splitSha} — a empurrar para ${repo}:${branch} ...`);

    // push <sha>:refs/heads/<branch> cria/atualiza a branch remota com esse commit
    try {
      const pushCmd = `git push ${repo} ${splitSha}:refs/heads/${branch}`;
      const pushOut = runCommand(pushCmd, { env: process.env });
      process.stdout.write(pushOut || '');
      console.log(`✅ ${folder} sincronizado (split pushed as ${branch})`);
      return true;
    } catch (pushErr) {
      const pushErrText = (pushErr.stdout || '') + (pushErr.stderr || '') + (pushErr.message || '');
      console.error(`❌ Falha ao empurrar split para remoto: ${pushErrText}`);
      return false;
    }

  } catch (splitErr) {
    const splitErrText = (splitErr.stdout || '') + (splitErr.stderr || '') + (splitErr.message || '');
    console.error(`❌ Falha ao criar split para ${folder}: ${splitErrText}`);
    return false;
  }
}

try {
  const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD').trim();
  console.log('\n🌿 SEMIS | Sync automático de subtrees');
  console.log(`🌿 Branch: ${currentBranch}`);

  const diffOutput = runCommand('git diff-tree --no-commit-id --name-only -r HEAD').toString();
  const changedFiles = diffOutput
    .split('\n')
    .map(f => f.replace(/\\/g, '/').trim())
    .filter(Boolean);

  // DEBUG (opcional) - podes activar se precisares de ver os ficheiros detectados
  // console.log('📄 Ficheiros alterados detectados pelo hook:', changedFiles);

  SUBTREES.forEach(({ folder, repo }) => {
    const touched = changedFiles.some(f => f.startsWith(folder + '/'));
    if (!touched) return;

    console.log(`🔄 Sincronizando ${folder}`);
    const ok = tryPushSubtree(folder, repo, currentBranch);
    if (!ok) {
      // Não aborta o commit — apenas informa. Se quiseres abortar, faz process.exit(1)
      console.error(`❌ Erro final ao sincronizar ${folder}. Continua com o commit no core, mas verifica manualmente.`);
    }
  });
} catch (err) {
  console.error('⚠️ Erro inesperado no sync de subtrees:');
  console.error(err && (err.stack || err.message || err));
}
