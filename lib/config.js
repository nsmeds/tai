const {alert, alertErr} = require(__dirname+'/cli-tools');

module.exports = (sander, github_org, github_token) => {
  if (!(github_org && github_token)) return alertErr('plz specify github_org github_token')

  let configJson = JSON.stringify({github_org, github_token})
  sander.writeFile(__dirname+'/../', 'config.json', configJson)
    .then(() => alert('config complete'))
    .catch(err => alertErr(err))
}
