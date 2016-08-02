const exec = (cmd, cwd) => require('child_process').execSync(cmd,{cwd: cwd || __dirname})
const execP = (cmd, cwd) => console.log(require('child_process').execSync(cmd,{cwd: cwd || __dirname}).toString());

module.exports = (repoName, { org }) => {
  execP(`open https://github.com/${org}/${repoName}`);
}
