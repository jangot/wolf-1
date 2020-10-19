const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const ENV = process.env.APP_ENV;
const isTest = ENV === 'test';
const isProd = ENV === 'prod';

function setDevTool() {
    if (isTest) {
        return 'inline-source-map';
    } else if (isProd) {
        return 'source-map';
    } else {
        return 'eval-source-map';
    }
}

const config = {
    mode: "development",
    entry: {
        index: './src/second/index.ts'
    },
    output: {
        filename: 'bundle-[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', 'scss'],
    },
    devtool: setDevTool(),
    plugins: [],
    devServer: {
        contentBase: __dirname,
        port: 3000,
        disableHostCheck: true,
    }
}

if (isProd) {
    config.plugins.push(
        new UglifyJSPlugin()
        //new CopyWebpackPlugin({
        //             patterns: [
        //                 { from: __dirname + '/src/public' }
        //             ],
        //         }),
    );
}

module.exports = config;
