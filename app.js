const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const cors = require('@koa/cors')
const timer = require('./middlewares/timer')
const logger = require('./helper/logger')
const index = require('./routes')
const depsInstall = require('./depsInstall')

depsInstall()
onerror(app)
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }))
app.use(
    cors({
        credentials: true,
    })
)
app.use(json())
app.use(require('koa-static')(__dirname + '/build'))
app.use(timer(logger))
app.use(index.routes(), index.allowedMethods())

app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx)
})

module.exports = app
