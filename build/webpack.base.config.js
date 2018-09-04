const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
        app: ['babel-polyfill', './client/index.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: isDev ? '/' : '/' // 确保文件资源能够正确的访问
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',     // 将ES6语法编程成ES5语法
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|eot|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    // 解释在这 https://github.com/vuejs-templates/webpack/issues/215 
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};