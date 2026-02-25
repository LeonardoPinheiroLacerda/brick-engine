const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            'game.bundle': './src/index.ts',
        },
        devtool: isProduction ? false : 'source-map',
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: 'auto',
            library: {
                name: 'BrickEngine',
                type: 'umd',
            },
        },
        externals: {
            p5: 'p5',
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.wav', '.png', '.ico', '.gif', '.json', '.svg'],
        },
        devServer: {
            static: [
                {
                    directory: path.resolve(__dirname, 'dist'),
                },
            ],
            port: 9000,
            open: true,
            hot: true,
            historyApiFallback: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                favicon: './public/favicon.ico',
                inject: 'body',
                chunks: ['game.bundle'],
                meta: {
                    author: 'https://github.com/LeonardoPinheiroLacerda',
                    'Content-Type': 'text/html; charset=UTF-8',
                    viewport: 'width=device-width, initial-scale=1.0',
                },
                minify: isProduction
                    ? {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeAttributeQuotes: true,
                      }
                    : false,
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'node_modules/p5/lib/p5.min.js', to: 'vendor/p5.min.js' },
                    { from: 'public/images', to: 'images' },
                    { from: 'public/sounds', to: 'sounds' },
                    { from: 'public/fonts', to: 'fonts' },
                    { from: 'public/docs', to: 'docs' },
                    { from: 'public/favicon.ico', to: './' },
                    { from: 'public/CNAME', to: './' },
                ],
            }),
        ],
        optimization: {
            minimize: isProduction,
        },
    };
};
