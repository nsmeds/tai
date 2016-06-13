'use strict';
const program = require('commander')
const addBranches = require('./lib/add-branches')
const hooks = require('./lib/ci-hooks')
const close = require('./lib/close-out')
const openGithub = require('./lib/open-github')
const sander = require('sander');
const {alert, alertErr, getConfigs} = require(__dirname+'/lib/cli-tools');

program
  .command('config <github_org> <github_token>')
  .description('configure github_org github_token')
  .action((github_org, github_token) => {
    if (!(github_org && github_token)) return alertErr('plz specify github_org github_token')
    let configJson = JSON.stringify({github_org, github_token})
    sander.exists(__dirname, 'config.json')
      .then(exists => {
        if (exists) return sander.unlink(__dirname, 'config.json');
      })
      .then(() => {
        sander.writeFile(__dirname, 'config.json', configJson).then(alert('config complete'))
      })
  })

program
  .command('setup <repoName>')
  .description('create branches for each team')
  .action((repoName, options) => {
    getConfigs()
      .then((configs) => {
        if (!repoName) return alertErr('plz specify repo name');
        addBranches( repoName, configs )
          .then( () => alert( 'branches created' ) )
          .then( () => hooks( repoName, configs ) )
          .then( () => alert( 'hooks complete' ) )
          .catch( err => {
            alertErr('error setting up repo');
            console.log(err);
          } );
      })
      .catch(err => {
        alertErr( 'error retreiving configs. run config' )
        console.log(err);
      })
  })

program
  .command('close <repoName>')
  .description('merge student branches into master folders')
  .action((repoName, options) => {
    getConfigs()
      .then((configs) => {
        if (!repoName) return alertErr('plz specify repo name');
        close(repoName, configs);
      })
      .catch(err => {
        alertErr('error retreiving configs. run config');
        console.log(err);
      })
  })

program
  .command('team <filepath>')
  .description('set teams to specified json filepath')
  .action((filepath, options) => {
    sander.readFile(filepath)
      .then(data => {
        alert('setting student teams to \n' + data);
        return sander.writeFile(__dirname, 'teams.json', data)
      })
      .then(() => alert('student teams set'))
      .catch(() => alertErr('error setting teams'))
  })

program
  .command('hub <repo_name>')
  .description('open repo on github')
  .action((repoName, options) => {
    getConfigs()
      .then((configs) => {
        openGithub(repoName, configs)
      })
      .catch(err => {
        alertErr(err);
        console.log(err);
      })
  })


program.parse(process.argv)
