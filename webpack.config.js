const path = require('path')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, './dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        port: 9001,
        compress: true
    }
};