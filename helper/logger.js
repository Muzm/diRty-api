const chalk = require('chalk')

function makeLogger(color) {
    const scope = color('[dirty-server]')
    return (...args) => {
        console.log(scope, ...args)
    }
}
module.exports = {
    log: makeLogger(chalk.gray),
    info: makeLogger(chalk.green),
    warn: makeLogger(chalk.yellow),
    error: makeLogger(chalk.red),
}
