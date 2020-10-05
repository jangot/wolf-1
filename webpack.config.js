const path = require('path');

module.exports = {
    entry: {
        // index: './src/index.ts',
        second: './src/second/index.ts'
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
    output: {
        filename: 'bundle-[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
};
