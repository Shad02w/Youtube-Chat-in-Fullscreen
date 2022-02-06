import { build } from 'esbuild'
import { buildOptions } from './common'

build({
    ...buildOptions,
    minify: true,
    sourcemap: 'inline'
})
