const fp = require('fastify-plugin')
const contentParserGen = require('./contentParserGen')

module.exports = fp(
  async function(fastify, config) {
    fastify.addContentTypeParser('multipart', contentParserGen(config))
  },
  { fastify: '>=2.0.0', name: 'fastify-busboy-rx' }
)
