/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   release
 */

'use strict';

const project = foxtrel.project;
const config = foxtrel.config;
const util = require('./util');

//context
const context = project.getProjectRoot('src');

const defalutConfig = {
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                enforce: 'pre'
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": ['es2015', {"modules": false}, 'react'],
                        "plugins": [
                            ["import", {libraryName: "antd-mobile", style: "css"}] // `style: true` 会加载 less 文件
                        ]
                    }
                },
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
        modules: ["node_modules"],
        extensions: ['.js', '.jsx', '.json']
    }
}


module.exports = function (path, options) {

    //entry
    let entryFile = util.getEntryFile('**/app.js', {cwd: context});
    if (path) {
        entryFile = project.getProjectRoot(path);
    }

    //output file 输出到缓存
    let outputFile = project.getCachePath();
    if (options.dest) {
        outputFile = project.getProjectRoot(options.dest);
    }

    if (options.env == 'dist') {
        distConfig(options);
    } else {
        envConfig(options);
    }

};


function envConfig() {
    var env = {
        cache: true,
        devtool: 'eval-source-map',

    }

    foxtrel.util.merge(env, defalutConfig);
}


function distConfig() {

}


