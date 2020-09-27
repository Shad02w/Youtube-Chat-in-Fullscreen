const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false
        })],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000

    },
    plugins: [
        // ...common.plugins,
        new BundleAnalyzerPlugin()
    ]

})