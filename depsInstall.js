const exec = require('child-process-promise').exec
const getDeps = require('./helper/getDeps')
const logger = require('./helper/logger')
const path = require('path')

const installDeps = async (packageTool = 'npm') => {
  try {
    await getNeteaseMusicAPI();
    await runNeteaseMusicAPI();
  } catch(e) {
    logger.error('NeteaseCloudMusicApi error:', e)
  }
}

async function getNeteaseMusicAPI () {
  const neteaseRepo = 'https://github.com/Binaryify/NeteaseCloudMusicApi.git';
  await getDeps(neteaseRepo);
}

async function runNeteaseMusicAPI () {
  const cmd = resolveCMD();
  const options = { cwd: path.resolve(__dirname, '.deps/NeteaseCloudMusicApi') }
  exec(cmd, options);
  logger.info('NeteaseCloudMusicApi run in port 3002 ')
}

function resolveCMD () {
  const platform = process.platform;
  const setEnv=  platform === 'win32' ? 'set PORT=3002 &' : 'PORT=3002';
  const cmd = `${setEnv} node app.js`
  return cmd;
}

module.exports = installDeps