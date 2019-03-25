const test = require('ava')
const logger = require('../logger')

test('logger', t => {
    logger.info('info')
    logger.log('log')
    logger.warn('warn')
    logger.error('error')
    t.pass()
})
