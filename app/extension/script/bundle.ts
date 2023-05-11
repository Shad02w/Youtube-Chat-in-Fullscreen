import esbuild from 'esbuild'
import yargs from 'yargs'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import { hideBin } from 'yargs/helpers'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
        path.join(__dirname, '../src/background.ts'),
        path.join(__dirname, '../src/inject.ts'),
        path.join(__dirname, '../src/popup/index.ts'),
        path.join(__dirname, '../src/popup/index.html'),
        path.join(__dirname, '../src/iframe.css')
    ]

    const options: esbuild.BuildOptions = {
        entryPoints: [
            ...entries.flatMap((_) => [
                { in: _, out: `chrome/${path.basename(_, path.extname(_))}` },
                { in: _, out: `firefox/${path.basename(_, path.extname(_))}` }
            ]),
            { in: path.join(__dirname, '../manifest.json'), out: 'chrome/manifest' },
            { in: path.join(__dirname, '../manifest.firefox.json'), out: 'firefox/manifest' }
        ],
        loader: {
            '.html': 'copy',
            '.json': 'copy'
        },
        mainFields: ['svelte', 'browser', 'module', 'main'],
        outdir: path.join(__dirname, '../dist'),
        metafile: true,
        bundle: true,
        minify: true,
        sourcemap: mode === 'dev',
        color: true,
        target: 'es2015',
        plugins: [
            sveltePlugin({
                compilerOptions: {
                    css: true
                },
                preprocess: [sveltePreprocess()]
            }),
            cleanup(),
            buildTarget(),
            time()
        ]
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
            const distDir = path.join(__dirname, '../dist')
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
