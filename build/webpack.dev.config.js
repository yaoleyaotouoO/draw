const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');


const isDev = process.env.NODE_ENV === 'development';

module.exports = merge(baseWebpackConfig, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../index.html') // 模板html, 一开始加载的html
        }),
        new webpack.HotModuleReplacementPlugin()    // 热替换
    ],
    // 配置启动选项和api选项
    devServer: {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        historyApiFallback: true,
        hot: true
    },
    devtool: 'inline-source-map' // 调试方便，可以看到错误信息出现在未生成之前的js中

});