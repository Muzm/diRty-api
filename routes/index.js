const router = require('koa-router')()
const musicAPI = require('music-api')

const axios = require('axios')
const CircularJSON = require('circular-json')

const neteaseApi = '207.148.102.95:3002'

router.get('/getSong', async (ctx, next) => {
    try {
        if (!ctx.request.query.id || !ctx.request.query.vendor) {
            ctx.response.status = 422
            ctx.body = 'Vendor or Song id is empty'
        } else {
            let data = await axios.get(
                `http://${neteaseApi}/song/url?id=${ctx.request.query.id}`
            )
            ctx.body = data.data
        }
    } catch (err) {
        console.error('Gettin Song error: ' + err)
    }
})


router.get('/userPlayList', async (ctx, next) => {
    try {
        let data = await axios.get(
            `http://${neteaseApi}/user/playlist?uid=${ctx.request.query.uid}`
        )
        let limit =
            ctx.query.limit === 'all'
                ? data.data.playlist.trackCount
                : ctx.query.limit

        ctx.body = CircularJSON.stringify(data.data)
    } catch (err) {
        console.error('Getting My Play List error: ' + err)
    }
})

router.get('/albumDetail', async (ctx, next) => {
    try {
        let data = await axios.get(
            `http://${neteaseApi}/album?id=${ctx.query.id}`
        )
        const limit =
            ctx.query.limit === 'all' ? data.data.songs.length : ctx.query.limit
        data.data.songs = data.data.songs.slice(
            limit * ctx.query.offset,
            limit * ctx.query.offset + limit
        )
        ctx.body = CircularJSON.stringify(data.data)
    } catch (e) {
        console.error('Getting album detail error' + e)
    }
})

router.get('/artist/album', async (ctx, next) => {
    try {
        let data = await axios.get(
            `http://${neteaseApi}/artist/album?id=${ctx.query.id}&limit=${
                ctx.query.limit
            }&offset=${ctx.query.offset * ctx.query.limit}`
        )
        ctx.body = CircularJSON.stringify(data.data)
    } catch (e) {
        console.error('Getting album detail error' + e)
    }
})

router.get('/listDetail', async (ctx, next) => {
    try {
        let data = await axios.get(
            `http://${neteaseApi}/playlist/detail?id=${
                ctx.request.query.id
            }&timestamp=${new Date().getTime()}`
        )
        let limit =
            ctx.request.query.limit === 'all'
                ? data.data.playlist.trackCount
                : ctx.request.query.limit
        let offset = ctx.request.query.offset
        data.data.playlist.tracks = data.data.playlist.tracks.slice(
            limit * offset,
            limit * offset + limit
        )
        ctx.body = data.data // add offset and limit
    } catch (e) {
        console.error('Getting Play List Detail Error: ' + e)
    }
})

module.exports = router
