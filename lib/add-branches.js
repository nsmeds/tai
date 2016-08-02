const GitHub = require('github-api');
// let students = require('/../teams.json');
const {alert, alertErr} = require('./cli-tools');

module.exports = function addBranches( repoName, configs ) {
  let students = require('/../teams.json');
  if (!students.length) return alertErr('no teams. set teams with tai team');

  const gh = new GitHub({token: configs.github_token});
  const repo = gh.getRepo( configs.github_org, repoName );
  return Promise.all(students.map( s => repo.createBranch( 'master', s )));
};
