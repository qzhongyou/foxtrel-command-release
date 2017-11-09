/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   release
 */

'use strict';

const glob = require('glob');
const path = require('path');

module.exports.getEntryFile = function (path, options) {
    let files = glob.sync(path, options),
        entries = {};
    files.forEach(function (file) {
        let ext = foxtrel.util.pathInfo(file).ext,
            pathName = file.replace("." + ext, ''),
            filePath = "";
        if (options.cwd) {
            filePath = file;
        }
        entries[pathName] = filePath;
    })
    return entries;
}
