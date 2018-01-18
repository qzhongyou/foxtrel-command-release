/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   util
 */

'use strict';

const path = require('path');
const config = require('./config');

module.exports = {
    compilers: function () {
        let slice = Array.prototype.slice;
        let compilerTypes = slice.call(arguments, 0, -1);
        let callback = slice.call(arguments, -1)[0];
        if (typeof callback != 'function') {
            foxtrel.log.error(`[compilers]: callback is not a function !`);
        }

        //遍历多个解析器
        compilerTypes.forEach(function (type, index) {
            if (typeof type == 'string') {
                type = type.trim();
                if (~foxtrel.util.get(config, 'processor').indexOf(type)) {
                    let compiler = foxtrel.require('processor',type);
                    callback(compiler);
                } else {
                    foxtrel.log.warning(`invalid type of processor [${type}]!`)
                }
            }else{
                foxtrel.log.warning(`type is not String !`);
            }
        })
    }
}
