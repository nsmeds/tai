'use strict';
const program = require('commander')
const config = require('./lib/config');
const addBranches = require('./lib/add-branches')
const hooks = require('./lib/ci-hooks')
const close = require('./lib/close-out')
const openGithub = require('./lib/open-github')
const { alert, alertErr } = require('./lib/cli-tools');
const sander = require('sander');
const branches = require('./teams.json')

program
  .command('config <github_org> <github_token>')
  .description('configure github_org github_token')
  .action(config.set);

program
  .command('team <filepath>')
  .description('set teams to specified json filepath')
  .action(filepath => {
    sander.readFile(filepath)
      .then(data => {
        alert('setting student teams to \n' + data);
        return sander.writeFile(__dirname, 'teams.json', data)
      })
      .catch(err => alertErr(err))
  });
  
program
  .command('setup <repoName>')
  .option('-b, --branches', 'specify a custom list of branches in json format')
  .description('create branches for each team')
  .action(repoName => {
    config.branches = program.branches ? JSON.parse(program.branches) : branches;
    config.ready()
      .then( () => addBranches( repoName, config ) )
      .then( () => alert( 'branches created' ) )
      .then( () => hooks( repoName, config ) )
      .then( () => alert( 'hooks complete' ) )
      .catch( err => {
        alertErr('error setting up repo');
        alertErr(err)
      });
  })

program
  .command('close <repoName>')
  .description('merge student branches into master folders')
  .action(repoName => {
    config.ready()
      .then( () => close(repoName, config) )
      .then( () => alert(`repo "${repoName}" closed out`))
      .catch(err => {
        alertErr('error closing repo');
        alertErr(err);
      });
  });


program
  .command('hub <repo_name>')
  .description('open repo on github')
  .action(repoName => {
    config.ready()
      .then( () => openGithub(repoName, configs) )

  });

program.parse(process.argv)
