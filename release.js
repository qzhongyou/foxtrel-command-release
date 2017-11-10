/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   release
 */

'use strict';
const bulid = require('./lib/bulid');


exports.name = "release"

exports.usage = '[options]';

exports.desc = 'release components';

exports.register = function (commander) {
    commander
        .option('-f,--file <filename>', 'config file', String, 'foxtrel.config.js')
        .option('-c, --clean', 'clean compile cache')
        .option('-w, --watch', 'monitor the changes of project')
        .option('-o, --optimize', 'with optimizing')
        .option('-e,--env <names>', 'compile environment', String, 'dev')
        .option('-d, --dest <path>', 'release output destination', String, '')
        .option('-r, --root <names>', 'set project root', String, process.cwd())
        .action(release)
}

function release(options) {
    //设置项目根目录
    foxtrel.project.setProjectRoot(options.root);

    //设置输出路径
    if (options.dest) {
        foxtrel.cache.setCachePath(options.dest);
    }
    const config = require('./lib/config');
    //配置获取
    foxtrel.config.merge(config(options));

    //项目配置文件
    let configFile = foxtrel.project.getProjectRoot(options.file);
    if (configFile) require(configFile);

    //清除缓存
    if (options.clean) {
        foxtrel.cache.clean();
    }

    // console.log(JSON.stringify(foxtrel.config.data));
    //构建
    bulid(options);
}