const Fastify = require('fastify')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const tap = require('tap')

const fastifyBusboyRxPlugin = require('../src')

const fastify = Fastify()

tap.tearDown(() => fastify.close())
tap.plan(1)

fastify.register(fastifyBusboyRxPlugin)
fastify.post('/', async req => tap.type(req.body, 'ReplaySubject'))

const form = new FormData()
form.append('myfile', fs.createReadStream(path.resolve(process.cwd(), `README.md`)))

fastify.inject({ method: 'post', url: '/', payload: form }).then(tap.pass, tap.fail)
