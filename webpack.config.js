const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = (env = {}, argv) => {
    const isProduction = argv.mode === 'production';
    const appMode = env.mode || 'server'; // 'server' or 'client'
    const clientGamePath = env.game ? path.resolve(process.cwd(), env.game) : path.resolve(__dirname, 'src/menu/GameMenu.ts');

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
            'brick-engine': './src/index.ts',
            app: './src/main.ts',
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true, // Clean the output directory before emit.
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
                        'css-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i, // Fonts (Required for CSS url() resolution)
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.wav', '.png', '.ico', '.gif', '.json', '.svg', '.webmanifest'],
            alias: {
                '@client-game': clientGamePath,
            },
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
                'process.env.APP_MODE': JSON.stringify(appMode),
                'process.env.SUPABASE_URL': JSON.stringify(SUPABASE_URL),
                'process.env.SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html', // Output file name
                favicon: './public/favicon.ico',
                inject: 'body',
                chunks: ['app'], // Only inject the app bundle, not the library
                minify: isProduction
                    ? {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeAttributeQuotes: true,
                      }
                    : false,
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].bundle.css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'node_modules/p5/lib/p5.min.js', to: 'vendor/p5.min.js' },
                    { from: 'public/images', to: 'images' },
                    { from: 'public/sounds', to: 'sounds' },
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
