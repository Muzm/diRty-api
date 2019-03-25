const test = require('ava')
const resolve = require('path').resolve
const exec = require('../exec')

console.log(__dirname)
const cmdOptions = { cwd: resolve(__dirname, 'fixtures') }

test('run a cat cmd', async t => {
    const result = await exec({ name: 'Get aaa', cmd: 'cat a', cmdOptions })
    t.is(result.stdout, 'aaa')
})
test('retry work well', async t => {
    await t.throwsAsync(async function retry() {
        await exec({ name: 'Retry', cmd: 'cat b', cmdOptions })
    })
})
