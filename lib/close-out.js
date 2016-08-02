const Git = require('nodegit');
let teams = require('../teams.json');
const repoPath = '../tmp_repo';
// const exec = (cmd, cwd) => require('child_process').execSync(cmd,{cwd: cwd || repoPath});
const execP = (cmd, cwd) => console.log(require('child_process').execSync(cmd,{cwd: cwd || repoPath}).toString());
const sander = require('sander');
const exclude = ['LAB.md', '.git'];
const {alert, alertErr} = require('./cli-tools');

module.exports = (repoName, configs) => {
  // TODO: Get branch names from repo instead of teams.json
  // github-api  http://michael.github.io/github/docs/2.3.0/Repository.html#listBranches

  let teams = require('../teams.json');
  if (!teams.length) return alertErr('no teams. set teams with tai team');

  sander.exists(repoPath)
    .then(exists => {
      // if (exists) sander.unlink(repoPath)
      //dare exec rimraf??
      if (exists) execP('rm -rf tmp_repo', repoPath+'/../');
    })
    .then(() => {
      Git.Clone(`https://github.com/${configs.github_org}/${repoName}`, repoPath)
        .then(handleNextBranch);
    });
};

function handleNextBranch(repo) {
  if (!teams.length) return travisAndPush();
  var team = teams.shift();

  execP(`git checkout ${team}`);
  execP('git status');
  return sander.readdir(repoPath)
    .then(files => {console.log(files); return files.filter(file => exclude.concat([team]).indexOf(file) < 0); })
    .then(files => files.length ? files: Promise.reject('no files'))
    .then(files => files.map(file => sander.rename(repoPath, file).to(repoPath, team, file)))
    .then(promises => Promise.all(promises))
    .then( () => {
      execP(`mkdir -p ${team}`);
      execP('git add -A');
      execP(`git commit -m 'moved student work to folder'`);
      execP(`git checkout master`);
      try {
        execP(`git merge ${team}`);
      } catch (err) {
        execP('git add -A');
        execP(`git commit -m 'merge conflicts'`);
      }
      alert(`closed out ${team}`);
      hanldleNextBranch(repo);
    })
    .catch(err => {
      if (err === 'no files') {
        alertErr(`WARNING: no files for ${team}`);
        execP(`git checkout master`);
        hanldleNextBranch(repo);
      } else alertErr(err);
    });
}

function travisAndPush() {
  execP('cp ./.travis.yml '+repoPath, '/../');
  execP('git add -A');
  execP(`git commit -m 'moved student work from branches to team folders'`);
  execP('git push origin master');
}
