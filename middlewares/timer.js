const chalk = require('chalk');
module.exports = function (logger) {
  return async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    logger.info(`${chalk.gray(ctx.method, ctx.url)} - ${ms}ms`)
  }
}