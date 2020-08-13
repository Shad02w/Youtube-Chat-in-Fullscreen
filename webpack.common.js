const HtmlWp = require('html-webpack-plugin')
const CopyWp = require('copy-webpack-plugin')
const path = require('path')
const { merge } = require('webpack-merge')

module.exports = merge({}, {
    entry: {
        background: "./src/background.ts",
        popup: "./src/popup.ts",
        liveChatRequestReplay: './src/liveChatRequestReplay.tsx'
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
            },
            {
                test: /.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
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
                {
                    from: path.resolve(__dirname, './src/images'),
                    to: path.resolve(__dirname, 'build', 'images')
                },
            ]
        })
    ],
}
)