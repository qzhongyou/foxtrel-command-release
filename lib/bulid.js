/**
 * @authors       qzhongyou
 * @date          2017-11-10
 * @description   bulid 构建
 */

'use strict';

const webpack = require('webpack');


module.exports = function (options) {

    var compiler = webpack(foxtrel.config.data);

    //watch
    if (options.watch) {
        compiler.watch({ignored: /node_modules/}, printStats);
    } else {
        compiler.run(printStats);
    }

};


function printStats(error, stats) {
    //webpack 配置错误
    if (error) {
        console.log(error.stack || error);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }

    //编译报错
    const info = stats.toJson();
    if (stats.hasErrors()) {
        console.log(`[errors]${info.errors}`.red.bold);
    }

    //编译警告
    if (stats.hasWarnings()) {
        console.log(`[warnings]${info.warnings}`.yellow.bold);
    }

    console.log(stats.toString({
        colors: true,    // 在控制台展示颜色
        version: false   // 隐藏版本
    }));

}
