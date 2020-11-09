module.exports = {
    rootDir: 'src',
    verbose: true,
    testPathIgnorePatterns: ['<rootDir>/ui-testing'],
    moduleNameMapper: {
        '@models/(.*)': ['<rootDir>/models/$1']
    }
}