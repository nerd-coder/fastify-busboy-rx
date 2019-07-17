import { FastifyRequest, Plugin } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { ReplaySubject } from 'rxjs'
import busboy from 'busboy'

declare type BusboyResult =
  | {
      type: 'file'
      args: {
        fieldname: string
        file: NodeJS.ReadableStream
        filename: string
        encoding: string
        mimetype: string
      }
    }
  | {
      type: 'field'
      args: {
        fieldname: string
        val: any
        fieldnameTruncated: boolean
        valTruncated: boolean
        encoding: string
        mimetype: string
      }
    }
declare type BusboyReplaySubject = ReplaySubject<BusboyResult>

declare let fastifyBusboyRX: Plugin<Server, IncomingMessage, ServerResponse, busboy.BusboyConfig>

export = fastifyBusboyRX
