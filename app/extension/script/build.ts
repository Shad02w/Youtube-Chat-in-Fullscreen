import task from 'tasuku'
import path from 'path'
import fs from 'fs-extra'
import { spawnSync } from 'child_process'

const RSPACK_CONFIG_FILE = path.join(__dirname, 'rspack.config.ts')

async function run() {
    await task('clean dist', async () => {
        return fs.rm(path.join(__dirname, '../dist'), { recursive: true, force: true })
    })

    await task('bundle', async ({ setStatus, setError }) => {
        const result = spawnSync('rspack', ['build', '--config', RSPACK_CONFIG_FILE, '--mode', 'production'], {
            shell: true
        })

        if (result.stderr.length !== 0) {
            setStatus(result.status === null ? undefined : result.status.toString())
            setError(result.stderr.toString())
        }
    })
}

run()
