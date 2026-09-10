const { execFileSync, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const allowedScripts = new Set([
    'init-submodules.sh',
    'create-branch-all.sh',
    'switch-branch-all.sh',
])

const scriptName = process.argv[2]

if (!allowedScripts.has(scriptName)) {
    console.error(`Unknown script: ${scriptName || '(missing)'}`)
    process.exit(1)
}

const projectRoot = path.resolve(__dirname, '..')
const scriptPath = path.join(__dirname, scriptName)
let bashPath = 'bash'

if (process.platform === 'win32') {
    try {
        const gitExecPath = execFileSync('git', ['--exec-path'], {
            encoding: 'utf8',
            windowsHide: true,
        }).trim()
        const gitRoot = path.resolve(gitExecPath, '..', '..', '..')
        const gitBashPath = path.join(gitRoot, 'bin', 'bash.exe')

        if (!fs.existsSync(gitBashPath)) {
            throw new Error(`Git Bash was not found at ${gitBashPath}`)
        }

        bashPath = gitBashPath
    } catch (error) {
        console.error(`Unable to locate Git Bash: ${error.message}`)
        process.exit(1)
    }
}

const result = spawnSync(bashPath, [scriptPath, ...process.argv.slice(3)], {
    cwd: projectRoot,
    stdio: 'inherit',
    windowsHide: true,
})

if (result.error) {
    console.error(`Unable to run ${scriptName}: ${result.error.message}`)
    process.exit(1)
}

process.exit(result.status ?? 1)
