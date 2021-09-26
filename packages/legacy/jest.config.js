module.exports = {
    rootDir: 'src',
    verbose: true,
    testPathIgnorePatterns: ['<rootDir>/ui-testing'],
    moduleNameMapper: {
        '@models/(.*)': ['<rootDir>/models/$1'],
        '@hooks/(.*)': ['<rootDir>/components/hooks/$1'],
        '@/(.*)': ['<rootDir>/$1']
    }
}
