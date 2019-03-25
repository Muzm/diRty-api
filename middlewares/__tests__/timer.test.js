const test = require('ava')
const timer = require('../timer')

test('timer work well', async t => {
    const ctx = {
        method: 'GET',
        url: 'fake url',
    }
    await timer(console)(ctx, () => {})
    t.pass()
})
