const Busboy = require('busboy')
const rxjs = require('rxjs')
const { ReplaySubject } = rxjs

function fileArgsParser([fieldname, file, filename, encoding, mimetype]) {
  return { fieldname, file, filename, encoding, mimetype }
}
function fieldArgsParser([fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype]) {
  return { fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype }
}
class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.status = 400
  }
}

/**
 * @param {busboy.BusboyConfig} busboyConfig
 * @returns {( req: import('http').IncomingMessage) => Promise}
 * @this {import('fastify').FastifyInstance}
 */
function contentParserGen(busboyConfig) {
  return async req => {
    const { headers, ...otherConfig } = busboyConfig
    const busboy = new Busboy({ headers: { ...req.headers, ...headers }, ...otherConfig })
    const replay = new ReplaySubject()

    busboy.on('error', err => replay.error(err))
    busboy.on('finish', () => replay.complete())
    busboy.on('partsLimit', () => replay.error(new BadRequestError('partsLimit')))
    busboy.on('filesLimit', () => replay.error(new BadRequestError('filesLimit')))
    busboy.on('fieldsLimit', () => replay.error(new BadRequestError('fieldsLimit')))
    busboy.on('file', (...args) => replay.next({ type: 'file', ...fileArgsParser(args) }))
    busboy.on('field', (...args) => replay.next({ type: 'field', ...fieldArgsParser(args) }))

    req.pipe(busboy)
    req.once('close', () => busboy.end())

    return replay
  }
}

module.exports = contentParserGen
