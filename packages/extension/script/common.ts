import path from 'path'
import fs from 'fs-extra'
import copy from 'esbuild-plugin-copy'
import { BuildOptions, Plugin } from 'esbuild'

const outdir = path.resolve(__dirname, '../dist')

const manifestPath = path.resolve(__dirname, '../src/manifest.json')
const iconsPath = path.resolve(__dirname, '../src/icons/*')

const clean: Plugin = {
    name: 'clean',
    setup: async build => {
        build.onStart(async () => fs.rm(outdir, { recursive: true, force: true }))
    }
}

export const buildOptions: BuildOptions = {
    entryPoints: {
        background: path.resolve(__dirname, '../src/background.ts'),
        'content-script': path.resolve(__dirname, '../src/content-script.ts')
    },
    outdir,
    bundle: true,
    plugins: [
        clean,
        copy({
            assets: [
                {
                    from: manifestPath,
                    to: outdir
                },
                {
                    from: iconsPath,
                    to: path.join(outdir, 'icons')
                }
            ],
            verbose: false
        })
    ]
}
