const router = require('koa-router')()
const musicAPI = require('music-api')

const axios = require('axios')
const CircularJSON = require('circular-json')


const neteaseApi = "127.0.0.1:3002"

router.get('/getSong', async (ctx, next) => {
  try {
    if (!ctx.request.query.id || !ctx.request.query.vendor) {
        ctx.response.status = 422
        ctx.body = 'Vendor or Song id is empty'
    } else {
        ctx.body = await musicAPI.getSong(ctx.request.query.vendor, {
            id: ctx.request.query.id,
            raw: false,
        })
    }
  } catch (err) {
      console.error('Gettin Song error: ' + err)
  }
})

router.get('/search', async (ctx, next)=> {
  let searchFetcher =  async (query)=> {
    try {
      if(query.vendor === "xiami") {
        if(query.type === 1) {
          return await musicAPI.searchSong("xiami", {
            key: query.keyword,
            limit: 50 || query.limit,
            offset: 0 || query.offset
          })
        } else if(query.type === 2) {
          return await musicAPI.searchAlbum("xiami", {
            key: query.keyword,
            limit: 50 || query.limit,
            offset: 0 || query.offset
          })
        }
      } else {
        let data = await axios.get(`http://127.0.0.1:3002/search?keywords=${query.keyword}&type=${query.type || 1}&offset=${query.offset * query.limit || 0}&limit=${query.limit}`)
        return data.data
      }
    } catch(e) {
      console.log("search error")
    }
  }

  const query = ctx.request.query
  if(!query.keyword) {
    ctx.response.status = 302
    ctx.body = "need keyword to search"
  } else {
    ctx.body = CircularJSON.stringify(await searchFetcher(query))
  }
})

router.get('/userPlayList', async (ctx, next) => { // 348024701
  try {
    let data = await axios.get(`http://127.0.0.1:3002/user/playlist?uid=${ctx.request.query.uid}`)
    let limit = ctx.query.limit === 'all' ? data.data.playlist.trackCount : ctx.query.limit
    
    ctx.body = CircularJSON.stringify(data.data)
  } catch(err) {
    console.error("Getting My Play List error: " + err)
  }
})

router.get('/albumDetail', async (ctx, next)=> {
  try {
    let data = await axios.get(`http://127.0.0.1:3002/album?id=${ctx.query.id}`)
    const limit = ctx.query.limit === 'all' ? data.data.songs.length : ctx.query.limit
    data.data.songs = data.data.songs.slice(limit * ctx.query.offset, limit * ctx.query.offset + limit)
    ctx.body = CircularJSON.stringify(data.data)
  } catch(e) {
    console.error("Getting album detail error" + e)
  }
})

router.get('/artist/album', async (ctx, next)=>{
  try {
    let data = await axios.get(`http://127.0.0.1:3002/artist/album?id=${ctx.query.id}&limit=${ctx.query.limit}&offset=${ctx.query.offset * ctx.query.limit}`)
    ctx.body = CircularJSON.stringify(data.data)
  } catch(e) {
    console.error("Getting album detail error" + e)
  }
})

router.get('/listDetail', async (ctx, next)=> {
  try {
    let data = await axios.get(`http://127.0.0.1:3002/playlist/detail?id=${ctx.request.query.id}&timestamp=${(new Date()).getTime()}`)
    let limit = ctx.request.query.limit === 'all' ? data.data.playlist.trackCount : ctx.request.query.limit
    let offset = ctx.request.query.offset
    data.data.playlist.tracks = data.data.playlist.tracks.slice(limit * offset, limit * offset + limit)
    ctx.body = data.data // add offset and limit
  } catch(e) {
    console.error("Getting Play List Detail Error: " + e)
  }
})

module.exports = router