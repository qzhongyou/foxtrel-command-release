/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   release
 */

'use strict';
const bulid = require('./lib/bulid');

const ph = require('path');

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

function release() {
    let options = Array.prototype.slice.call(arguments, -1)[0];

    //设置项目根目录
    foxtrel.project.setProjectRoot(options.root);


    //配置文件读取
    let configFile = foxtrel.project.getProjectRoot(options.file);
    if (configFile) {
        require(configFile);
    }


    if (!options.dest) {
        options.dest = foxtrel.config.get('webpack.output.path') || foxtrel.config.get('name');
    } else {
        options.dest = ph.resolve(foxtrel.project.getProjectRoot(), options.dest);
    }
    //设置output(缓存)路径
    foxtrel.cache.setCachePath(options.dest);


    // open文件夹
    if (arguments[0] == 'open') {
        require('./lib/open')(foxtrel.cache.getCachePath());
        return;
    }

    //清除缓存
    if (options.clean) {
        foxtrel.cache.clean();
    }

    //构建
    bulid(options);
}
