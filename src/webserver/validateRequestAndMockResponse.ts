import * as express from 'express'
import { ERROR_UNKNOWN, STATUS_CODE_500, createErrorBody } from '../common/errors'
import { VirtualServerRequest, VirtualServerResponse } from '../mid/models'
import { generateResponse } from '../mid/cordinator'
import { isNullOrUndefined, logger } from '../common/utils'
import { profiles } from '../common/config'

function getProfileByHost(host: string): Record<string, any> {
    if (isNullOrUndefined(host)) return {}
    const arr = host.split(':')
    let port = '443'
    if (arr.length > 1) port = arr[1]
    if (isNullOrUndefined(profiles[port])) return {}
    return profiles[port]
}

function createRequest(req: express.Request): VirtualServerRequest {
    return {
        query: req.query,
        url: req.url,
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        method: req.method,
        headers: req.headers,
        body: req.body
    } as VirtualServerRequest
}

function createDefaultResponse(): VirtualServerResponse {
    return new VirtualServerResponse(
        STATUS_CODE_500.toString(),
        createErrorBody(STATUS_CODE_500, ERROR_UNKNOWN)
    )
}

export function validateRequestAndMockResponse(app: any | express.Express) {
    app.all('*', (req: express.Request, res: express.Response) => {
        logger.info(
            `[HITTING] ${req.method} ${req.originalUrl} with body: ${JSON.stringify(
                req.body,
                null,
                4
            )}`
        )
        res.on('finish', () => {
            logger.info(`[RESPONSE] code: ${res.statusCode}`)
        })

        const response = createDefaultResponse()
        generateResponse(createRequest(req), response, getProfileByHost(req.headers.host as string))
            .then(() => {
                for (const name in response.headers) res.setHeader(name, response.headers[name])
                res.status(parseInt(response.statusCode)).json(response.body)
            })
            .catch((reason) => {
                res.status(500).json({ error: reason })
            })
    })
}
