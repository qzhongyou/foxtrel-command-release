/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   config
 */

'use strict';

const project = foxtrel.project;

const util = require('./util');

const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

//context
const context = project.getProjectRoot('src');

const publicPath = '/assets/';

let entryFile, envConfig;


let defalutConfig = {
    context: context,
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                options: {
                    configFile: project.getProjectRoot('.eslintrc')
                },
                include: [context],
                enforce: 'pre'
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1&modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!less-loader'
                })
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                use: 'url-loader?limit=8192'
            },
            {
                test: /\.(mp4|ogg|svg)$/,
                use: 'file-loader'
            }
        ]
    },
    resolve: {
        modules: [context, "node_modules"],
        extensions: ['.js', '.jsx', '.json'],
        //为更好使用webpack tree shaking功能,先读取package中module字段
        mainFiles: ['module', 'main', 'index']
    }
}


module.exports = function (options) {
    //entry
    entryFile = util.getEntryFile('**/app.js', {cwd: context});

    //环境判断
    if (options.env == 'dist') {
        envConfig = distConfig(options);
    } else {
        envConfig = devConfig(options);
    }

    return Object.assign({}, envConfig, defalutConfig, {
        entry: entryFile,
        output: {
            path: foxtrel.cache.getCachePath(),
            filename: '[name].[hash].js',
            publicPath: publicPath
        }
    })
};

//开发环境配置
function devConfig(options) {
    var base = {
        cache: true,
        devtool: 'eval-source-map',
        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.ProvidePlugin({$: 'jquery'}),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
        ]
    };

    //HMR
    for (let key in entryFile) {
        entryFile[key] = [].concat([
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            entryFile[key]
        ]);
    }

    defalutConfig.module.rules.push({
        test: /\.(js|jsx)$/,
        use: {
            loader: 'babel-loader'
        },
    });

    return base;
}

//生产环境配置
function distConfig(options) {
    var base = {
        cache: true,
        devtool: 'sourcemap',
        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
            new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
            //入口文件不在引入jquery,可以直接使用jquery
            new webpack.ProvidePlugin({$: 'jquery'}),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    //提取所有node_modules中模块到vendor
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            //为了避免vendor中hash改变
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            })
        ]
    }

    defalutConfig.module.rules.push({
        test: /\.(js|jsx)$/,
        use: {
            loader: 'babel-loader',
            options: {
                "presets": [['es2015', {"modules": false}], "stage-0", 'react'],
                "plugins": [
                    ["import", {libraryName: "antd-mobile", style: "css"}] // `style: true` 会加载 less 文件
                ]
            }
        },
    });

    return base;
}


