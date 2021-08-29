module.exports = {
    entry: {
        vendor: './src/index.js',
    },
    mode: 'development',
    module: {
        rules: [],
    },
    plugins: [],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
}
