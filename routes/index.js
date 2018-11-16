const router = require('koa-router')()
const musicAPI = require('music-api')

const axios = require('axios')
const CircularJSON = require('circular-json')

const neteaseApi = "127.0.0.1:3002"

router.get('/getSong', async (ctx, next) => {
  try {
    if (!ctx.request.query.id || !ctx.request.query.vendor) {
      ctx.response.status = 302
      ctx.body = "Vendor or Song id is empty"
    } else {
      ctx.body = await musicAPI.getSong(ctx.request.query.vendor, { 
        id: ctx.request.query.id,
        raw: false
      })
    }
  } catch(err) {
    console.error("Gettin Song error: " + err)
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
        let data = await axios.get(`http://127.0.0.1:3002/search?keywords=${query.keyword}&type=${query.type || 1}&offset=${query.offset || 0}&limit=${query.limit}`)
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
    ctx.body = CircularJSON.stringify(data.data)
  } catch(err) {
    console.error("Getting My Play List error: " + err)
  }
})

let offsetParser = (list, limit, offset = 0) => {
  let iter = (list, limit, offset, index) => {
    if (index === offset) {
      return list.slice(index * limit, index * limit + limit)
    } else {
      return iter(list, limit, offset, index + 1)
    }
  }
  return iter(list, Number(limit), Number(offset), 0)
}

router.get('/listDetail', async (ctx, next)=> {
  try {
    let offset = ctx.request.query.offset || 0
    let data = await axios.get(`http://127.0.0.1:3002/playlist/detail?id=${ctx.request.query.id}&timestamp=${(new Date()).getTime()}`)
    let limit = ctx.request.query.limit === 'all' || !ctx.request.query.limit ? data.data.playlist.trackCount : ctx.request.query.limit
    data.data.playlist.tracks = offsetParser(
      data.data.playlist.tracks, limit, 
      ctx.request.query.limit > data.data.playlist.trackCount ? 0 : offset
      )
    ctx.body = data.data // add offset and limit
  } catch(e) {
    console.error("Getting Play List Detail Error: " + e)
  }
})





module.exports = router