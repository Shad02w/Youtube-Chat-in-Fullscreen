import esbuild from 'esbuild'
import yargs from 'yargs'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import { hideBin } from 'yargs/helpers'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { htmlPlugin } from '@craftamap/esbuild-plugin-html'

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

    const options: esbuild.BuildOptions = {
        entryPoints: {
            background: path.join(__dirname, '../src/background.ts'),
            inject: path.join(__dirname, '../src/inject.ts'),
            popup: path.join(__dirname, '../src/popup/index.ts')
        },
        mainFields: ['svelte', 'browser', 'module', 'main'],
        outdir: path.join(__dirname, '../dist/out'),
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
            htmlPlugin({
                files: [
                    {
                        filename: 'popup.html',
                        entryPoints: [],
                        scriptLoading: 'defer',
                        htmlTemplate: path.join(__dirname, '../src/popup/index.html')
                    }
                ]
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
            if (await fs.exists(distDir)) {
                build.onStart(async () => {
                    await fs.rm(distDir, { recursive: true, force: true })
                    console.log(`🧹cleanup ${distDir}`)
                })
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
        name: 'buildTarget',
        setup(build) {
            build.onEnd(async () => {
                await Promise.all([
                    fs.mkdir(path.join(__dirname, '../dist/target/firefox'), { recursive: true }),
                    fs.mkdir(path.join(__dirname, '../dist/target/chrome'), { recursive: true })
                ])
                await Promise.all([
                    fs.copyFile(
                        path.join(__dirname, '../manifest.firefox.json'),
                        path.join(__dirname, '../dist/target/firefox/manifest.json')
                    ),
                    fs.copyFile(
                        path.join(__dirname, '../manifest.json'),
                        path.join(__dirname, '../dist/target/chrome/manifest.json')
                    )
                ])

                await Promise.all([
                    fs.copy(path.join(__dirname, '../dist/out'), path.join(__dirname, '../dist/target/chrome')),
                    fs.copy(path.join(__dirname, '../dist/out'), path.join(__dirname, '../dist/target/firefox'))
                ])
            })
        }
    }
}
