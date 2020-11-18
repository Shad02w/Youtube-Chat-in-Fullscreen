const HtmlWp = require('html-webpack-plugin')
const CopyWp = require('copy-webpack-plugin')
const path = require('path')
const { merge } = require('webpack-merge')

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
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@hooks': path.resolve(__dirname, 'src/components/hooks'),
            '@components': path.resolve(__dirname, 'src/components'),
            "@models": path.resolve(__dirname, 'src/models'),
            "@css": path.resolve(__dirname, 'src/css'),
            "@icons": path.resolve(__dirname, 'src/icons'),
            "@contexts": path.resolve(__dirname, 'src/contexts'),
            "@": path.resolve(__dirname, 'src'),
        }
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
                    from: path.resolve(__dirname, './src/icons'),
                    to: path.resolve(__dirname, 'build', 'icons')
                },
            ]
        })
    ]
})