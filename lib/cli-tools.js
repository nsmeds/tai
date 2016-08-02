const chalk = require('chalk');

exports.alert = (msg) => console.log(chalk.green('[*]', msg));
exports.alertErr = (msg) => console.log(chalk.red('[x]', msg));
//
// exports.getConfigs = () => {
//   return sander.readFile('../config.json')
//       .then(data => JSON.parse(data))
//       .then(configs => {
//         if (!(configs.github_org && configs.github_token)) {
//           throw 'configs not defined';
//         }
//         return configs;
//       });
// };
