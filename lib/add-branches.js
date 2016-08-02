const GitHub = require('github-api');
const {alert, alertErr} = require('./cli-tools')

module.exports = function addBranches(repoName, { branches, token, org }) {
	if (!branches.length) return alertErr('no branches provided. either set with "tai team branches.json" or supply "-b $(cat branches.json)"')

	const gh = new GitHub({ token });
	const repo = gh.getRepo(org, repoName);
	const promises = branches.map(b => repo.createBranch('master', b));
	return Promise.all(promises);
}
