const GitHub = require('github-api');
// let students = require('/../teams.json');
const {alert, alertErr} = require('./cli-tools');

module.exports = function addBranches( repoName, prefs ) {
  // let students = require('/../teams.json');
  if (!prefs.students.length) return alertErr('no teams. set teams with tai team');

  const gh = new GitHub({token: prefs.github_token});
  const repo = gh.getRepo( prefs.github_org, repoName );
  return Promise.all(prefs.students.map( s => repo.createBranch( 'master', s )));
};
