const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWepack = require('html-webpack-plugin')

module.exports = merge({}, {
    entry: {
        index: './src/ui-testing/App.test.tsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'ui-test')
    },
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'ui-test'),
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new HtmlWepack({
            filename: 'index.html',
            template: './src/testing/index.html',
            chunks: ['index']
        })
    ]
})