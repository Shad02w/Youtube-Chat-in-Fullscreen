import esbuild from 'esbuild'
import yargs from 'yargs'
import path from 'path'
import fs from 'fs-extra'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'

async function run() {
    const { mode } = await yargs.options({
        mode: {
            alias: 'm',
            describe: 'Set the mode',
            choices: ['dev', 'prod'],
            demandOption: true,
            default: 'dev'
        }
    }).argv

    const options: esbuild.BuildOptions = {
        entryPoints: [
            path.join(__dirname, '../src/background.ts'),
            path.join(__dirname, '../src/inject.ts'),
            path.join(__dirname, '../src/popup/index.ts')
        ],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        outdir: path.join(__dirname, '../dist/out'),
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
            time(),
            buildTarget()
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
        setup(build) {
            const outdir = build.initialOptions.outdir
            if (outdir) {
                build.onStart(() => {
                    console.log(`🧹cleanup ${outdir}`)
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
