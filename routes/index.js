const router = require('koa-router')()
const musicAPI = require('music-api')

const axios = require('axios')
const CircularJSON = require('circular-json')

const neteaseApi = "127.0.0.1:3002"
router.get('/searchSong', async (ctx, next) => {
  try {
    if (!ctx.request.query.key || !ctx.request.query.vendor) {
      ctx.response.status = 302
      ctx.body = "Vendor or key is empty"
    } else {
      ctx.body = await musicAPI.searchSong(ctx.request.query.vendor, {
        key: ctx.request.query.key,
        limit: 20,
        page: 1,
      })
    }
  } catch(err) {
    console.log("Searching Error: " + err)
  }
})

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

router.get('/getAlbum', async (ctx, next) => {
  if (!ctx.request.query.id) {
    ctx.response.status = 302
    ctx.body = "Ablum id is invaild"
  } else {
    try {
      ctx.body = await musicAPI.getAlbum(ctx.request.query.vendor, {
        id: ctx.request.query.id,
        raw: false
      })
    } catch(err) {
      console.error("Getting album error: " + err)
    }
  }
})

router.get('/search', async (ctx, next)=> {
  let searchFetcher =  async (query)=> {
    try {
      if(query.vendor === "xiami") {
        if(query.searchType === 1) {
          return await musicAPI.searchSong("xiami", {
            key: query.keyword,
            limit: 50 || query.limit,
            offset: 0 || query.offset
          })
        } else if(query.searchType === 2) {
          return await musicAPI.searchAlbum("xiami", {
            key: query.keyword,
            limit: 50 || query.limit,
            offset: 0 || query.offset
          })
        }
      } else {
        let data = await axios.get(`http://127.0.0.1:3002/search?keywords=${query.keyword}&type=${query.searchType || 1}&offset=${query.offset || 0}`)
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
    console.log(ctx.body);  
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

let offsetParser = (list, limit, offset = 0, index = 0) => {
  let iter = (list, limit, offset, index) => {
    if (index === offset) {
      return list.slice(index * limit, index * limit + limit)
    } else {
      return iter(list, limit, offset, index + 1)
    }
  }
  return iter(list, Number(limit), Number(offset), index)
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


// router.get('/search', async (ctx, next) => { // 488968776
//   try {
//     ctx.body = await CircularJSON.stringify(axios.get(`http://${neteaseApi}/search?keywards=${ctx.request.query.keyword}&type=${ctx.request.query.type || 1}`)) 
//   } catch(err) {
//     console.error("Searcg error: " + err)
//   }
// })



module.exports = router