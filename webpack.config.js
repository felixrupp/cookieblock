var path = require('path');
module.exports = {
    entry: [
        'babel-polyfill',
        './src/main.js'
    ],
    output: {
        path: path.join(__dirname, '.tmp'),
        filename: 'CookieBlock.js',
        libraryTarget: "umd",
        library: "cookieblock"
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    //plugins: ['transform-runtime'],
                    presets: ['env']
                }
            }
        ]
    }
};