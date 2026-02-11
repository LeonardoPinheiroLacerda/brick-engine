const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.ts',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        output: {
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true, // Clean the output directory before emit.
            publicPath: '/',
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
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.wav', '.png', '.ico', '.gif', '.json', '.svg', '.webmanifest'],
        },
        devServer: {
            static: {
                directory: path.resolve(__dirname, 'dist'),
            },
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
        ],
        optimization: {
            runtimeChunk: 'single', // Separate runtime chunk for better caching
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
    };
};
