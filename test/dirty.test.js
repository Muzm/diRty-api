require('../bin/www') // run the server
const request = require('superagent')
const test = require('ava')
const url = `http://127.0.0.1:${process.env.PORT}`

const searchSongRequest = () => request.get(url + '/searchSong')
const assertVendorOrKeyEmpty = t => err => {
    t.is(err.response.statusCode, 422)
    t.is(err.response.text, 'Vendor or key is empty')
    t.end()
}
test.cb('[searchSong] key empty', t => {
    searchSongRequest()
        .query({ vendor: 'some', key: '' })
        .catch(assertVendorOrKeyEmpty(t))
})
test.cb('[searchSong] vendor empty', t => {
    searchSongRequest()
        .query({ vendor: '', key: 'some' })
        .catch(assertVendorOrKeyEmpty(t))
})

const assertBadKey = t => err => {
    t.is(err.response.statusCode, 404)
    t.is(err.response.text, 'Not Found')
    t.end()
}
test.cb('[searchSong] bad key', t => {
    searchSongRequest()
        .query({ vendor: '1', key: '1' })
        .catch(assertBadKey(t))
})
