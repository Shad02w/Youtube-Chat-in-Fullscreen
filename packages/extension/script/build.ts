import { build } from 'esbuild'
import fs from 'fs/promises'
import path from 'path/posix'

const outdir = path.resolve(__dirname, '../dist')
const manifestPath = path.resolve(__dirname, '../src/manifest.json')

const clean = async () => fs.rm(outdir, { recursive: true, force: true })
const copyManifest = async () => fs.copyFile(manifestPath, path.join(outdir, './manifest.json'))

const buildScript = async () =>
    build({
        bundle: true,
        entryPoints: {
            background: path.resolve(__dirname, '../src/background.ts'),
            'content-script': path.resolve(__dirname, '../src/content-script.ts')
        },
        outdir
    })

const run = async () => {
    await clean()
    await buildScript()
    await copyManifest()
}

run()
