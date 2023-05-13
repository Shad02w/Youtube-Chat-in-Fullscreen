import esbuild from 'esbuild'
import yargs from 'yargs'
import path from 'path'
import fs from 'fs/promises'
import solidPlugin from '@ycf/esbuild-plugin-solid'
import { fileURLToPath } from 'url'
import { hideBin } from 'yargs/helpers'

const dir = path.dirname(fileURLToPath(import.meta.url))

async function run() {
    const { mode } = await yargs(hideBin(process.argv)).options({
        mode: {
            alias: 'm',
            describe: 'Set the mode',
            choices: ['dev', 'prod'],
            demandOption: true,
            default: 'prod'
        }
    }).argv

    const entries: string[] = [
        path.join(dir, '../src/background.ts'),
        path.join(dir, '../src/inject.tsx'),
        path.join(dir, '../src/popup/index.tsx'),
        path.join(dir, '../src/popup/index.html'),
        path.join(dir, '../src/iframe.css')
    ]

    const options: esbuild.BuildOptions = {
        entryPoints: [
            ...entries.flatMap((_) => [
                { in: _, out: `chrome/${path.basename(_, path.extname(_))}` },
                { in: _, out: `firefox/${path.basename(_, path.extname(_))}` }
            ]),
            { in: path.join(dir, '../manifest.json'), out: 'chrome/manifest' },
            { in: path.join(dir, '../manifest.firefox.json'), out: 'firefox/manifest' }
        ],
        loader: {
            '.html': 'copy',
            '.json': 'copy'
        },
        mainFields: ['svelte', 'browser', 'module', 'main'],
        outdir: path.join(dir, '../dist'),
        bundle: true,
        minify: true,
        sourcemap: mode === 'dev',
        color: true,
        target: 'es2015',
        plugins: [solidPlugin(), cleanup(), buildTarget(), time()]
    }

    if (mode === 'dev') {
        const ctx = await esbuild.context(options)
        await ctx.watch()
    } else {
        await esbuild.build(options)
    }
}

run()

function cleanup(): esbuild.Plugin {
    return {
        name: 'cleanup',
        async setup(build) {
            const distDir = path.join(dir, '../dist')
            try {
                await fs.access(distDir)
                build.onStart(async () => {
                    await fs.rm(distDir, { recursive: true, force: true })
                    console.log(`🧹cleanup ${distDir}`)
                })
            } catch {
                // do nothing
            }
        }
    }
}

function time(): esbuild.Plugin {
    return {
        name: 'time',
        setup(build) {
            build.onStart(() => {
                console.time('⚡build')
            })
            build.onEnd(() => {
                console.timeEnd('⚡build')
            })
        }
    }
}

function buildTarget(): esbuild.Plugin {
    return {
        name: 'copy out to target',
        setup(build) {
            build.onEnd(async () => {})
        }
    }
}
