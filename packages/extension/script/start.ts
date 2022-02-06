import { build } from 'esbuild'
import { buildOptions } from './common'

build({
    ...buildOptions,
    watch: {
        onRebuild(error, result) {
            if (error) {
                console.error('build failed', error)
            } else {
                console.log('rebuild success!')
            }
        }
    },
    sourcemap: 'inline'
})
