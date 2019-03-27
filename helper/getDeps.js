const fs = require('fs-extra');
const path = require('path');
const exec = require('./exec');

module.exports = async function getDeps(repo, packageTool = 'npm') {
  const distPath = path.resolve(__dirname, '../.deps');

  fs.ensureDirSync(distPath);

  const repoName = path.parse(repo).name;
  const depDistPath = path.resolve(distPath, repoName);
  const installed = fs.existsSync(depDistPath);
  if (!installed) {
    const cloneRepoCMD = {
      name: 'Clone repo ' + repoName,
      cmd: `git clone ${repo} ${depDistPath}`
    };
    await exec(cloneRepoCMD);
  }
  const depsInstalled = fs.existsSync(path.resolve(depDistPath, 'node_modules'));
  if (!depsInstalled) {
    const installDepsCMD = {
      name: 'Install ' + repoName + ' node_modules',
      cmd: `${packageTool} install`,
      cmdOptions: { cwd: depDistPath }
    }
    await exec(installDepsCMD);
  }
  return true;
}
