const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    // Suppress fatal error: Cannot resolve module 'fs'
    // @relative https://github.com/pugjs/pug-loader/issues/8
    // @see https://github.com/webpack/docs/wiki/Configuration#node
    node: {
        fs: 'empty',
        child_process: 'empty'
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ],
    watchOptions: {
        aggregateTimeout: 0
    },
    name: 'main',
    target: 'node',
    entry: './index.ts',
    output: {
        filename: './index.js',
        library: 'default',
        libraryTarget: 'umd',
        globalObject: 'typeof self !== \'undefined\' ? self : this', // webpack bug workaround, see https://github.com/webpack/webpack/issues/6784
    },
};