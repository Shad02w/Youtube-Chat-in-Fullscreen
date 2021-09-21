/** @type {import('eslint').Linter.Config} */
const config = {
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        es6: true,
    },
    extends: ['eslint:baseline'],
}

module.exports = config
