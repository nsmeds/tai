const chalk = require('chalk');
const sander = require('sander');

exports.alert = (msg) => console.log(chalk.green('[*]', msg));
exports.alertErr = (msg) => console.log(chalk.red('[x]', msg));