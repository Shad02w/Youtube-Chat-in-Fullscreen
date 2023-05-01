import task from 'tasuku'
import path from 'path'
import fs from 'fs-extra'
import { spawnSync } from 'child_process'

const RSPACK_CONFIG_FILE = path.join(__dirname, 'rspack.config.ts')

async function run() {
    await task('clean dist', async () => {
        return fs.rm(path.join(__dirname, '../dist'), { recursive: true, force: true })
    })

    await task('bundle', async ({ setStatus, setError, task }) => {
        const result = spawnSync('rspack', ['build', '--config', RSPACK_CONFIG_FILE], {
            shell: true
        })

        if (result.stderr.length !== 0) {
            setStatus(result.status === null ? undefined : result.status.toString())
            setError(result.stderr.toString())
            return
        }

        task('pack', async ({ task }) => {
            task('pack for target firefox', async () => {
                await fs.mkdir(path.join(__dirname, '../dist/target/firefox'), { recursive: true })
                await fs.copyFile(
                    path.join(__dirname, '../manifest.firefox.json'),
                    path.join(__dirname, '../dist/target/firefox/manifest.json')
                )
                await fs.copy(path.join(__dirname, '../dist/source'), path.join(__dirname, '../dist/target/firefox'))
            })

            task('pack for target chrome', async () => {
                await fs.mkdir(path.join(__dirname, '../dist/target/chrome'), { recursive: true })
                await fs.copyFile(
                    path.join(__dirname, '../manifest.json'),
                    path.join(__dirname, '../dist/target/chrome/manifest.json')
                )
                await fs.copy(path.join(__dirname, '../dist/source'), path.join(__dirname, '../dist/target/chrome'))
            })
        })
    })
}

run()
