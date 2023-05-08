import { defineConfig, definePlugin } from '@rspack/cli'
import type { RspackOptions } from '@rspack/core'
import fs from 'fs-extra'
import path from 'path'

const PLUGIN_NAME = 'EXTENSION_RELEASE'
const TARGET_DIRECTORY = path.join(__dirname, '../dist/target')

const buildTarget = definePlugin((compiler) => {
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, async () => {
        if (await fs.exists(TARGET_DIRECTORY)) {
            await fs.rm(TARGET_DIRECTORY, { recursive: true, force: true })
        }
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
            fs.copy(path.join(__dirname, '../dist/source'), path.join(__dirname, '../dist/target/chrome')),
            fs.copy(path.join(__dirname, '../dist/source'), path.join(__dirname, '../dist/target/firefox'))
        ])
    })
})

const config: RspackOptions = defineConfig({
    devtool: false,
    entry: {
        background: path.join(__dirname, '../src/background.ts'),
        inject: path.join(__dirname, '../src/inject.ts'),
        popup: path.join(__dirname, '../src/popup/index.ts')
    },
    output: {
        path: path.join(__dirname, '../dist/source')
    },
    builtins: {
        react: {
            runtime: 'automatic'
        },
        html: [
            {
                template: path.join(__dirname, '../src/popup/index.html'),
                filename: 'popup.html',
                chunks: ['popup']
            }
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: []
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.mjs', '.cjs', '.svelte'],
        mainFields: ['browser', 'module', 'main', 'svelte'],
        conditionNames: ['svelte']
    },
    plugins: [buildTarget]
})

export = config
