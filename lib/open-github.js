const execP = (cmd, cwd) => console.log(require('child_process').execSync(cmd,{cwd: cwd || __dirname}).toString());

module.exports = (repoName, configs) => {
  execP(`open https://github.com/${configs.github_org}/${repoName}`);
};
