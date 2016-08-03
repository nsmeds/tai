#!/usr/bin/env node

const program = require('commander');
const sander = require('sander');
const Preferences = require('preferences');

const hooks = require('./lib/ci-hooks');
const close = require('./lib/close-out');
const openGithub = require('./lib/open-github');
const addBranches = require('./lib/add-branches');
const {alert, alertErr} = require('./lib/cli-tools');

const prefs = new Preferences('tai');

program
  .command('config [github_org] [github_token]')
  .option('-s, --show', 'display current Github organization')
  .option('-d, --delete', 'delete current Github configuration')
  .description('Configure Github org and auth token.')
  .action((github_org, github_token, options) => {
    if (options.show) {
      if (prefs.github_org) return alert(`Current selected organization is ${prefs.github_org}`);
      else return alert('There is no current Github organization selected.');
    }
    if (options.delete) {
      prefs.github_org = undefined;
      prefs.github_token = undefined;
      return alertErr('Github configuration has been removed.');
    }
    prefs.github_org = github_org;
    prefs.github_token = github_token;
  });


program
  .command('setup <repoName>')
  .option('-b, --branches', 'specify a custom list of branches in json format')
  .description('Create branches for the specified team.')
  .action((repoName, options) => {
    if (!prefs.github_org) return alertErr('No configuration found.  run config');
    prefs.branches = options.branches ? JSON.parse(options.branches) : prefs.students;
    addBranches( repoName, prefs )
      .then(() => {
        alert( 'branches created' );
        hooks( repoName, prefs );
        alert( 'hooks complete' );
      })
      .catch( (err) =>  {
        console.log('Error setting up repo: ',err);
        alertErr('error setting up repo')
      });
  });

program
  .command('close <repoName>')
  .description('merge student branches into master folders')
  .action((repoName) => {
    if (!prefs) return alertErr('No configuration found.  run config');
    close(repoName, prefs)
      .then( () => alert(`repo "${repoName}" closed out`))
      .catch(err => {
        alertErr('error closing repo');
        alertErr(err);
      });
  });

program
  .command('team [filepath]')
  .description('set teams to specified json filepath')
  .action((filepath) => {
    if (!filepath && prefs.students) {
      alert('Teams currently set to: ');
      return console.log(prefs.students);
    }
    sander.readFile(filepath)
      .then(data => {
        alert('setting student teams to \n' + data);
        prefs.students = data.toString();
      })
      .catch((err) => {
        alertErr('error setting teams');
        console.log(err);
      });
  });

program
  .command('open <repo_name>')
  .description('open repo on github')
  .action(repoName => openGithub(repoName, prefs));


program.parse(process.argv);
