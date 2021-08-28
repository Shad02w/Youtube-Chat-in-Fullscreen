import { spawnSync } from 'child_process'

spawnSync('tsc', ['--project', './tsconfig.json'], {
    encoding: 'utf-8',
    shell: true,
    stdio: 'inherit',
})
