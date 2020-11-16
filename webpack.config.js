const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: {
        // index: './src/index.ts',
        second: './src/second/index.ts'
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
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
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            },
        ],
    },
    plugins: [
        new WebpackObfuscator({
            rotateStringArray: true
        }, ['bundle-second.js'])
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', 'scss'],
    },
    output: {
        filename: 'bundle-[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
};
