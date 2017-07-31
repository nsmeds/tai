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
  .command('config <github_org> <github_token>')
  .description('Configure Github org and auth token.')
  .action((github_org, github_token) => {
    prefs.github_org = github_org;
    prefs.github_token = github_token;
  });


program
  .command('org')
  .description('Display current Github organization.')
  .action(() => {
    if (prefs.github_org) return alert(`Current selected organization is ${prefs.github_org}`);
    else return alert('There is no current Github organization selected.');
  });

program
  .command('clear')
  .description('Clear current Github org and auth token.')
  .action(() => {
    prefs.github_org = undefined;
    prefs.github_token = undefined;
    return alertErr('Github configuration has been removed.');
  });


program
  .command('setup <repoName> [branches]')
  .description('Create branches for the specified team.')
  .action((repoName, branches) => {
    if (!prefs.github_org) return alertErr('No configuration found.  run config');
    prefs.branches = branches ? JSON.parse(branches) : prefs.students;
    addBranches( repoName, prefs )
      .then(() => {
        alert( 'branches created' );
      })
      .catch( (err) => {
        alertErr('Error setting up repo.');
        alertErr(err);
      });
  });

program
  .command('hooks <repoName>')
  .description('Create hooks.')
  .action((repoName) => {
    hooks(repoName, prefs)
      .then(() => {
        alert( 'hooks complete' );
      })
      .catch( err => {
        alertErr('error creating hooks: ', err);
      });
  });

program
  .command('close <repoName>')
  .description('merge student branches into master folders')
  .action((repoName) => {
    if (!prefs.github_org) return alertErr('No configuration found.  run config');
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
