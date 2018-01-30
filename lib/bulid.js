/**
 * @authors       qzhongyou
 * @date          2017-11-10
 * @description   bulid 构建
 */


'use strict';
const util = require('./util');


/**
 * @description  编译器配置信息
 * @param error
 * @param stats
 */
function printStats(error, stats) {
    //webpack 配置错误
    if (error) {
        console.log(error.stack || error);
        if (error.details) {
            console.error(error.details);
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

/**
 * @description 编译前,生成配置数据
 * @param config
 */

function compilerConfig(config) {
    foxtrel.util.merge(config, foxtrel.config.get('webpack'));
    foxtrel.config.set('webpack', config);
}


module.exports = function (options) {

    //项目类型获取
    let type = foxtrel.config.get('type');
    if (!foxtrel.util.isArray(type)) {
        type = [type];
    }

    util.compilers(...type, function (processor) {
        processor(function(compiler){
            let Compiler = compiler(options, compilerConfig);
            //watch
            if (options.watch) {
                Compiler.watch({ignored: /node_modules/}, printStats);
            } else {
                Compiler.run(printStats);
            }
        })
    })
}
