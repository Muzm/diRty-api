const test = require('ava');
const fs = require('fs-extra');
const resolve = require('path').resolve;
const rimraf = require('rimraf');
const getDeps = require('../getDeps');

const resolveDeps = (path) => resolve(__dirname, '../../.deps', path);

test('fetch remote repo work well', async t => {
  rimraf.sync(resolveDeps(''));
  await getDeps('https://github.com/Binaryify/NeteaseCloudMusicApi.git');
  t.true(fs.existsSync(resolveDeps('NeteaseCloudMusicApi')));
})