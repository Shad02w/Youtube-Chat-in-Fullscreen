import { defineConfig, definePlugin } from '@rspack/cli'
import type { RspackOptions } from '@rspack/core'
import path from 'path'

const PLUGIN_NAME = 'EXTENSION_RELEASE'
const release = definePlugin((compiler) => {
    compiler.hooks.afterDone.tap(PLUGIN_NAME, () => {
        console.log('hi')
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
