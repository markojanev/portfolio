const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, 'src/index.ts'),
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.(css)$/,
            use: [{
                    loader: "thread-loader",
                    options: {
                        workerParallelJobs: 2,
                    },
                }, "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                    },
                },
                {
                    loader: "postcss-loader",
                }
            ],
        }, {
            test: /\.(svg|jpg|jpeg|png|eot|ttf|woff|gif)$/,
            use: "file-loader",
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    performance: {
        hints: "warning",
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                parallel: true,
                terserOptions: {
                    ecma: 2016,
                    ie8: false,
                    compress: {
                        pure_funcs: ["console.debug", "console.log", "console.info", "console.warn"],
                    },
                    safari10: true,
                    sourceMap: false,
                    warnings: true,
                },
            }),
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/index.html'),
                to: path.resolve(__dirname, 'dist')
            }, {
                from: path.resolve(__dirname, 'assets'),
                to: path.resolve(__dirname, 'dist/assets')
            }]
        }),
    ],
    output: {
        filename: 'bundle.js',
        chunkFilename: "[name].js",
        path: path.resolve(__dirname, 'dist')
    }
};