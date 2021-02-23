import * as express from 'express'
import * as fs from 'fs'
import * as tls from 'tls'
import https = require('https')
import http = require('http')

export function getHttpsServer(app: any | express.Express) {
    const certs = {
        '127.0.0.1': {
            key: '.ssh/127-0-0-1-ca.pem',
            cert: '.ssh/127-0-0-1-ca.cer'
        },
        localhost: {
            key: '.ssh/localhost-ca.pem',
            cert: '.ssh/localhost-ca.crt'
        },
        'login.microsoftonline.com': {
            key: '.ssh/login-microsoftonline-com-ca.pem',
            cert: '.ssh/login-microsoftonline-com-ca.crt'
        }
    }
    const secureContexts = getSecureContexts(certs)
    const options = {
        // A function that will be called if the client supports SNI TLS extension.
        SNICallback: (servername: any, cb: any) => {
            const ctx = secureContexts[servername]

            if (!ctx) {
                console.log('Not found SSL certificate for host: ' + servername)
            } else {
                console.log('SSL certificate has been found and assigned to ' + servername)
            }

            if (cb) {
                cb(null, ctx)
            } else {
                return ctx
            }
        }
    }
    const httpsServer = https.createServer(options, app)
    return httpsServer
}

export function getHttpServer(app: any | express.Express) {
    return http.createServer(app)
}

function getSecureContexts(certs: any) {
    if (!certs || Object.keys(certs).length === 0) {
        throw new Error("Any certificate wasn't found.")
    }

    const certsToReturn: any = {}

    for (const serverName of Object.keys(certs)) {
        const appCert = certs[serverName]

        certsToReturn[serverName] = tls.createSecureContext({
            key: fs.readFileSync(appCert.key),
            cert: fs.readFileSync(appCert.cert)
        })
    }
    return certsToReturn
}
