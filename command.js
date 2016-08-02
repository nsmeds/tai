const program = require('commander');
const addBranches = require('./lib/add-branches');
const hooks = require('./lib/ci-hooks');
const close = require('./lib/close-out');
const openGithub = require('./lib/open-github');
const sander = require('sander');
const {alert, alertErr} = require('./lib/cli-tools');
const Preferences = require('preferences');
const prefs = new Preferences('tai');

program
  .command('config <github_org> <github_token>')
  .description('configure github_org github_token')
  .action((github_org, github_token) => {
    prefs.github_org = github_org;
    prefs.github_token = github_token;
  });

program
  .command('setup <repoName>')
  .description('create branches for each team')
  .action((repoName) => {
    if (!prefs) return alertErr('No configuration found.  run config');
    if (!repoName) return alertErr('No repo specified.');
    addBranches( repoName, prefs )
      .then( () => alert( 'branches created' ) )
      .then( () => hooks( repoName, prefs ) )
      .then( () => alert( 'hooks complete' ) )
      .catch( err => {
        alertErr('error setting up repo');
        console.log(err);
      });
  });

program
  .command('close <repoName>')
  .description('merge student branches into master folders')
  .action((repoName) => {
    if (!prefs) return alertErr('No configuration found.  run config');
    if (!repoName) return alertErr('No repo specified.');
    close(repoName, prefs);
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
  .action((repoName) => {
    openGithub(repoName, prefs);
  });

program.parse(process.argv);
