require('../bin/www') // run the server
const request = require('superagent')
const test = require('ava')
const url = `http://127.0.0.1:${process.env.PORT}`

// TODO: rewrite the search song api.
const searchSongRequest = () => request.get(url + '/searchSong')
const assertVendorOrKeyEmpty = t => err => {
    t.is(err.response.statusCode, 422)
    t.is(err.response.text, 'Vendor or key is empty')
    t.end()
}
const assertBadKey = t => err => {
    t.is(err.response.statusCode, 404)
    t.is(err.response.text, 'Not Found')
    t.end()
}
test.cb('[searchSong] key empty', t => {
    searchSongRequest()
        .query({ vendor: 'some' })
        .catch(assertVendorOrKeyEmpty(t))
})
test.cb('[searchSong] vendor empty', t => {
    searchSongRequest()
        .query({ key: 'some' })
        .catch(assertVendorOrKeyEmpty(t))
})
test.cb('[searchSong] bad vendor', t => {
    searchSongRequest()
        .query({ vendor: 'bad', key: '1' })
        .catch(assertBadKey(t))
})

// GET /getSong
const getSong = () => request.get(url + '/getSong')
const uid = 39449864
const assertVendorOrIdEmpty = (err, t) => {
    t.is(err.response.statusCode, 422)
    t.is(err.response.text, 'Vendor or Song id is empty')
}
test('[getSong] vendor or song id is empty', async t => {
    try {
        await getSong().query({ vendor: 'has' })
    } catch (err) {
        assertVendorOrIdEmpty(err, t)
    }
    try {
        await getSong().query({ id: 'has' })
    } catch (err) {
        assertVendorOrIdEmpty(err, t)
    }
})
test('[getSong] get user song', async t => {
    const res = await getSong().query({ id: uid, vendor: 'netease' })
    t.is(res.statusCode, 200)
    t.truthy(res.body.url)
})

// GET /userPlayList
const getUserPlayList = () => request.get(url + '/userPlayList')
test('[userPlayList] get user playlist', async t => {
    const res = await getUserPlayList().query({ uid })
    t.is(res.statusCode, 200)
    // TODO: fill the result asserts
})
