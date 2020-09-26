const HtmlWp = require('html-webpack-plugin')
const CopyWp = require('copy-webpack-plugin')
const path = require('path')
const {merge} = require('webpack-merge')

module.exports = merge({}, {
    entry: {
        background: path.resolve(__dirname, "./src/background.ts"),
        popup: path.resolve(__dirname, './src/popup.tsx'),
        inject: path.resolve(__dirname, './src/index.tsx'),
        pageInject: path.resolve(__dirname, './src/pageInject.ts'),
    },
    output: {
        filename: "[name].js",
        // chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
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
                path.resolve(__dirname, './src/logo.png'),
                {
                    from: path.resolve(__dirname, './src/images'),
                    to: path.resolve(__dirname, 'build', 'images')
                },
            ]
        })
    ]
})