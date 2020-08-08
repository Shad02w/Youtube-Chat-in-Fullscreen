const HtmlWp = require('html-webpack-plugin')
const CopyWp = require('copy-webpack-plugin')
const path = require('path')
const { merge } = require('webpack-merge')

module.exports = merge({}, {
    entry: {
        background: "./src/background.ts",
        popup: "./src/popup.ts",
        xhrMod: './src/xhrMod.ts',
        contentScript: './src/contentScript.ts'
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWp({
            template: path.join(__dirname, './src/popup.html'),
            filename: "popup.html",
            chunks: ['popup']
        }),
        new CopyWp({
            patterns: [
                path.resolve(__dirname, './src/manifest.json'),
                // path.resolve(__dirname, './src/api.js'),
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