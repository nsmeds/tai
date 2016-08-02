const sander = require('sander');
const {alert, alertErr} = require('./cli-tools');

const CONFIG_PATH = __dirname + './../config.json';

const config = module.exports = {
  org: '',
  token: '',
  set(github_org, github_token) {
    let configJson = JSON.stringify({github_org, github_token});
    return sander.writeFile(CONFIG_PATH, configJson)
      .then(() => setConfig({ github_org, github_token }));
  }
}

function setConfig({ github_org, github_token }) {
  config.org = github_org;
  config.token = github_token;
}

sander.readFile(CONFIG_PATH)
    .then(data => JSON.parse(data))
    .then(setConfig);



