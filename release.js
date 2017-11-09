/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   release
 */

'use strict';
const bulid = require('./lib/bulid');

exports.name = "release <file>"

exports.usage = '[options] <file>';

exports.desc = 'release components';

exports.register = function (commander) {
    commander
        .option('-f,--file <filename>', 'config file', String, 'foxtrel-config.js')
        .option('-c, --clean', 'clean compile cache')
        .option('-o, --optimize', 'with optimizing')
        .option('-e,--env <names>', 'compile environment', String, 'dev')
        .option('-d, --dest <path>', 'release output destination', String, '')
        .option('-r, --root <names>', 'set project root', String, process.cwd())
        .action(release)
}

function release(path, options) {

    //设置项目根目录
    foxtrel.project.setProjectRoot(options.root);

    //项目配置文件
    let configFile = foxtrel.project.getProjectRoot(options.file);
    if (configFile) require(configFile);

    //清除缓存
    if (options.clean) {
        foxtrel.cache.clean();
    }

    //构建
    bulid(path, options);
}