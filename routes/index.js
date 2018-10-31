const router = require('koa-router')()
const musicAPI = require('music-api');

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

router.get('/netList', async (ctx, next) => { // 488968776
  try {
    ctx.body = await musicAPI.getPlaylist('netease', {
     id: "488968776",
     raw: true
    })
  } catch(err) {
    console.error("Getting My Play List error: " + err)
  }
})

router.get('/xiamiList', async (ctx, next) => { // 488968776
  try {
    ctx.body = await musicAPI.getPlaylist('netease', {
     id: "488968776",
     raw: true
    })
  } catch(err) {
    console.error("Getting My Play List error: " + err)
  }
})

module.exports = router