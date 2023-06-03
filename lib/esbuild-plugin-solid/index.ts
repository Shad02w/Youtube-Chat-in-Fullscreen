import type { Plugin } from 'esbuild'
import { transformAsync } from '@babel/core'
import { createRequire } from 'module'
import fs from 'fs/promises'

const require = createRequire(import.meta.url)
const solid = require.resolve('babel-preset-solid')
const ts = require.resolve('@babel/preset-typescript')

export default function (): Plugin {
    return {
        name: 'esbuild-plugin-solid',
        setup(build) {
            build.onLoad({ filter: /\.(j|t)sx$/ }, async (args) => {
                const content = await fs.readFile(args.path, { encoding: 'utf8' })
                const result = await transformAsync(content, {
                    presets: [solid, ts],
                    filename: args.path
                })
                if (!result?.code) {
                    return {
                        errors: [
                            {
                                text: `Unable to transform file ${args.path}`
                            }
                        ]
                    }
                }
                return { contents: result.code, loader: 'js' }
            })
        }
    }
}
