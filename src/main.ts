import bodyParser = require('body-parser')
import express = require('express')
import { mockAuthServer } from './webserver/authserver'
import { mockMetadataEndpints } from './webserver/metadata-endpoints'
import { validateRequestAndMockResponse } from './webserver/validateRequestAndMockResponse'
import { getHttpsServer, getHttpServer } from './webserver/httpServerConstructor'

export function main() {
    const app = express()
    // your express configuration here
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    mockAuthServer(app)
    mockMetadataEndpints(app)
    validateRequestAndMockResponse(app)
    const httpsServer = getHttpsServer(app)
    httpsServer.listen(443, '0.0.0.0', function () {
        console.log('Listening https on port: 443')
    })
    const httpServer = getHttpServer(app)
    httpServer.listen(80, '0.0.0.0', function () {
        console.log('Listening https on port: 80')
    })

    const statelessServer = getHttpsServer(app)
    statelessServer.listen(8443, '0.0.0.0', function () {
        console.log('Listening https on port: 8443')
    })

    const internalErrorServer = getHttpsServer(app)
    internalErrorServer.listen(8445, '0.0.0.0', function () {
        console.log('Listening https on port: 8445')
    })
}

main()
