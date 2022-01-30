/** @type {import('eslint').Linter.Config} */
const config = {
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        es6: true
    },
    extends: ['plugin:@shad02w/baseline', 'plugin:react/jsx-runtime'],
    plugins: ['import', '@typescript-eslint', 'react'],
    rules: {
        'import/exports-last': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'react/display-name': 'off',
        'react/jsx-max-props-per-line': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
}

module.exports = config
