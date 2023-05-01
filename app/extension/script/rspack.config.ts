import { defineConfig, definePlugin } from '@rspack/cli'
import type { RspackOptions } from '@rspack/core'
import fs from 'fs-extra'
import path from 'path'

const PLUGIN_NAME = 'EXTENSION_RELEASE'
const TARGET_DIRECTORY = path.join(__dirname, '../dist/target')
const release = definePlugin((compiler) => {
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
    entry: {
        background: path.join(__dirname, '../src/background.ts')
    },
    output: {
        path: path.join(__dirname, '../dist/source')
    },
    builtins: {
        html: [
            {
                template: path.join(__dirname, '../src/popup.html'),
                filename: 'popup.html'
            }
        ]
    },
    plugins: [release]
})

export = config
