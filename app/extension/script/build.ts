import esbuild from 'esbuild'
import yargs from 'yargs'
import path from 'path'
import fs from 'fs/promises'
import solidPlugin from '@ycf/esbuild-plugin-solid'
import { fileURLToPath } from 'url'
import { hideBin } from 'yargs/helpers'
import cssModulesPlugin from 'esbuild-css-modules-plugin'

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
        path.join(dir, '../src/iframe.css')
    ]

    const getFileName = (filepath: string) => {
        const relative = path.relative(path.join(dir, '../src'), filepath)
        return relative.slice(0, relative.lastIndexOf('.'))
    }

    const options: esbuild.BuildOptions = {
        entryPoints: [
            ...entries.flatMap((_) => [
                { in: _, out: `chrome/${getFileName(_)}` },
                { in: _, out: `firefox/${getFileName(_)}` }
            ]),
            { in: path.join(dir, '../manifest.json'), out: 'chrome/manifest' },
            { in: path.join(dir, '../manifest.firefox.json'), out: 'firefox/manifest' }
        ],
        loader: {
            '.json': 'copy'
        },
        outdir: path.join(dir, '../dist'),
        bundle: true,
        metafile: true,
        minify: true,
        sourcemap: mode === 'dev',
        color: true,
        target: 'es2015',
        plugins: [solidPlugin(), cssModulesPlugin(), cleanup(), buildTarget(), time()]
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
            try {
                const { outdir } = build.initialOptions
                if (!outdir) return
                await fs.access(outdir)
                build.onStart(async () => {
                    await fs.rm(outdir, { recursive: true, force: true })
                    console.log(`🧹cleanup ${outdir}`)
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
            let start: number = 0
            build.onStart(() => {
                start = Date.now()
            })
            build.onEnd(({ errors }) => {
                if (errors.length !== 0) return
                console.log(`⚡build time: ${Date.now() - start}ms`)
            })
        }
    }
}

function buildTarget(): esbuild.Plugin {
    return {
        name: 'copy files to target',
        setup(build) {
            build.onEnd(async () => {
                const popup = path.join(dir, '../src/popup.html')
                await fs.copyFile(popup, path.join(dir, '../dist/chrome/popup/index.html'))
                await fs.copyFile(popup, path.join(dir, '../dist/firefox/popup/index.html'))
            })
        }
    }
}
