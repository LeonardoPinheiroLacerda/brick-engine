const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    // Load .env files, .env.local takes precedence.
    const envFileLocal = path.resolve(__dirname, '.env.local');
    const envFile = path.resolve(__dirname, '.env');

    let envConfig = {};
    if (fs.existsSync(envFile)) {
        Object.assign(envConfig, dotenv.config({ path: envFile }).parsed);
    }
    if (fs.existsSync(envFileLocal)) {
        Object.assign(envConfig, dotenv.config({ path: envFileLocal }).parsed);
    }

    // Fallback logic for webpack
    const SUPABASE_URL = process.env.SUPABASE_URL || envConfig.SUPABASE_URL || 'http://127.0.0.1:54321';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || envConfig.SUPABASE_ANON_KEY || '';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            'game.bundle': ['./src/main.ts', './src/index.ts'],
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
                                publicPath: '../', // CSS is in css/ folder, needs to go up to find images/fonts
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false, // Don't resolve url() in CSS, rely on CopyWebpackPlugin
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
            new webpack.DefinePlugin({
                'process.env.SUPABASE_URL': JSON.stringify(SUPABASE_URL),
                'process.env.SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
            }),
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
