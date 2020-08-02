const HtmlWp = require('html-webpack-plugin')
const CopyWp = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const { merge } = require('webpack-merge')

module.exports = merge({}, {
    entry: {
        background: "./src/background.js",
        popup: "./src/popup.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: []
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWp({
            template: path.join(__dirname, './src/popup.html'),
            filename: "popup.html",
            chunks: ['popup']
        }),
        new CopyWp({
            patterns: [
                path.resolve(__dirname, './src/manifest.json'),
                {
                    from: path.resolve(__dirname, './src/images'),
                    to: path.resolve(__dirname, 'build', 'images')
                },
                // { from: './src/manifest.json', to: './' },
                // { from: './src/images/**/*', to: './images' }
            ]
        })
    ],
}
)