import path from 'path'
import config from '../../../config/jest.config'
import type { Config } from '@jest/types'

const mergedConfig = {
    ...config,
    rootDir: path.resolve(__dirname, '../test')
} as Config.InitialOptions

export default mergedConfig
