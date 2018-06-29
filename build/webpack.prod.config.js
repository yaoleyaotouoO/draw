const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');


const isDev = process.env.NODE_ENV === 'development';

module.exports = merge(baseWebpackConfig, {
    plugins: [
        // 全局变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        // 模板html, 一开始加载的html
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../index.html')
        }),
        // 压缩 js
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ],
})