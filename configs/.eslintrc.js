/** @type {import('eslint').Linter.Config} */
const config = {
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        es6: true
    },
    extends: ['plugin:@shad02w/baseline'],
    plugins: ['import', '@typescript-eslint'],
    rules: {
        'import/exports-last': 'off',
        '@typescript-eslint/no-var-requires': 'off'
    }
}

module.exports = config
