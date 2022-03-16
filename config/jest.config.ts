import type { Config } from '@jest/types'
import path from 'path'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    verbose: true,
    globals: {
        'ts-jest': {
            tsconfig: path.resolve(__dirname, './tsconfig.jest.json')
        }
    }
}

export default config
