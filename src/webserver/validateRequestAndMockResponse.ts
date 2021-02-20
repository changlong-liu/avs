import * as express from 'express'
import { validateRequest } from '../mid/cordinator'
import { isNullOrUndefined } from '../common/utils'
import { profiles } from '../common/config'

function getProfileByHost(host: string): Record<string, any> {
    if (isNullOrUndefined(host)) return {}
    const arr = host.split(':')
    let port = '443'
    if (arr.length > 1) port = arr[1]
    if (isNullOrUndefined(profiles[port])) return {}
    return profiles[port]
}
export function validateRequestAndMockResponse(app: any | express.Express) {
    app.all('*', (req: express.Request, res: express.Response) => {
        console.log(
            req.method,
            'hitting: ',
            req.originalUrl,
            ' with body: ',
            JSON.stringify(req.body)
        )
        validateRequest(req, res, getProfileByHost(req.headers.host as string)).catch((reason) => {
            res.status(500).json({ error: reason })
        })
    })
}
