const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            'brick-engine': './src/index.ts',
            app: './src/main.ts',
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        output: {
            filename: isProduction ? '[name].js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true, // Clean the output directory before emit.
            publicPath: '',
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
                    test: /\.(png|gif|svg)$/i, // Images
                    type: 'asset/resource',
                    generator: {
                        filename: isProduction ? 'images/[name].[contenthash][ext]' : 'images/[name][ext]',
                    },
                },
                {
                    test: /\.wav$/i, // Audio
                    type: 'asset/resource',
                    generator: {
                        filename: isProduction ? 'sounds/[name].[contenthash][ext]' : 'sounds/[name][ext]',
                    },
                },
                {
                    test: /favicon\.ico$/i, // Favicon (root, no hash)
                    type: 'asset/resource',
                    generator: {
                        filename: 'favicon.ico',
                    },
                },
                {
                    test: /CNAME$/i, // CNAME (root, no ext, no hash)
                    type: 'asset/resource',
                    generator: {
                        filename: 'CNAME',
                    },
                },
                {
                    test: /modal\.js$/i, // modal.js (root, no hash)
                    type: 'asset/resource',
                    generator: {
                        filename: 'modal.js',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i, // Fonts
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.wav', '.png', '.ico', '.gif', '.json', '.svg', '.webmanifest'],
        },
        devServer: {
            static: [
                {
                    directory: path.resolve(__dirname, 'dist'),
                },
                {
                    directory: path.resolve(__dirname, 'node_modules/p5/lib'),
                    publicPath: '/vendor',
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
                filename: 'index.html', // Output file name
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
                ],
            }),
        ],
        optimization: {
            minimize: isProduction,
        },
    };
};
