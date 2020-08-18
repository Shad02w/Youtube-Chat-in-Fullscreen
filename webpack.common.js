const HtmlWp = require('html-webpack-plugin')
const CopyWp = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const { merge } = require('webpack-merge')

module.exports = merge({}, {
    entry: {
        background: path.resolve(__dirname, "./src/background.ts"),
        popup: path.resolve(__dirname, './src/popup.tsx'),
        liveChatRequestReplay: path.resolve(__dirname, './src/liveChatRequestReplay.tsx')
    },
    output: {
        filename: "[name].js",
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    fallback: 'file-loader'
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
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
            ]
        })
        // ,
        // new BundleAnalyzerPlugin()
    ]
})