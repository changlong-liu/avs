import bodyParser = require('body-parser')
import express = require('express')
import { getHttpServer, getHttpsServer } from './webserver/httpServerConstructor'
import { logger } from './common/utils'
import { mockAuthServer } from './webserver/authserver'
import { mockMetadataEndpints } from './webserver/metadata-endpoints'
import { validateRequestAndMockResponse } from './webserver/validateRequestAndMockResponse'

function logResponseBody(req: any, res: any, next: any) {
    const oldWrite = res.write
    const oldEnd = res.end
    const chunks: any = []

    res.write = function (...chunk: any) {
        chunks.push(chunk[0])
        return oldWrite.apply(res, chunk)
    }

    res.end = function (...chunk: any) {
        if (chunk) chunks.push(chunk[0])
        let body = Buffer.concat(chunks).toString('utf8')
        try {
            body = JSON.stringify(JSON.parse(body), null, 4)
        } catch {
            // keep origin body value if is not JSON
        }
        logger.info(`[RESPONSE] body: ${body}`)
        oldEnd.apply(res, chunk)
    }

    next()
}

export function main() {
    const app = express()
    // your express configuration here
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(logResponseBody)

    mockAuthServer(app)
    mockMetadataEndpints(app)
    validateRequestAndMockResponse(app)
    const httpsServer = getHttpsServer(app)
    httpsServer.listen(8441, '0.0.0.0', function () {
        logger.info('Listening https on port: 8441')
    })
    const httpServer = getHttpServer(app)
    httpServer.listen(8442, '0.0.0.0', function () {
        logger.info('Listening https on port: 8442')
    })

    const statelessServer = getHttpsServer(app)
    statelessServer.listen(8443, '0.0.0.0', function () {
        logger.info('Listening https on port: 8443')
    })

    const internalErrorServer = getHttpsServer(app)
    internalErrorServer.listen(8445, '0.0.0.0', function () {
        logger.info('Listening https on port: 8445')
    })
}

main()
