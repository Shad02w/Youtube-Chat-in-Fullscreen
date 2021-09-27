/* eslint-disable padding-line-between-statements -- require */
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const HtmlWebpack = require('html-webpack-plugin')

module.exports = merge(common, {
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
    plugins: [
        new HtmlWebpack({
            filename: 'index.html',
            template: './src/ui-testing/index.html',
            chunks: ['index']
        })
    ]
})
