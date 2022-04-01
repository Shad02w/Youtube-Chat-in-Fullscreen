import path from 'path'
import config from '../../../config/jest.config'
import type { Config } from '@jest/types'

const mergedConfig: Config.InitialOptions = {
    ...config,
    rootDir: path.resolve(__dirname, '../src'),
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/ui-testing'],
    moduleNameMapper: {
        '@models/(.*)': ['<rootDir>/models/$1'],
        '@hooks/(.*)': ['<rootDir>/components/hooks/$1'],
        '@/(.*)': ['<rootDir>/$1']
    },
    globals: {
        'ts-jest': {
            tsconfig: path.resolve(__dirname, './tsconfig.jest.json')
        }
    }
}

export default mergedConfig
