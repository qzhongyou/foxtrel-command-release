/**
 * @authors       qzhongyou
 * @date          2017-01-18
 * @description   open 文件夹
 */

'use strict';

const spawn = require('child_process').spawn;

module.exports = function (path) {
    let open = spawn('open', [path], {
        stdio: 'inherit'
    })

    open.on('close', function (code) {
        console.log(`child exists with code: ${code} , open ${path} `);
    });

    open.on('error', (err) => {
        console.log('Failed to start child process: ' + err);
    });

    process.on("exit", function () {
        child.kill();
    });
};
