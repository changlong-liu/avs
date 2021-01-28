import * as express from "express";
import { validateRequest } from "./validator";
import { isNullOrUndefined } from "./utils"

let profiles: Record<string, any> = {
    "443": {
        stateful: true,
    }
}

function getProfileByHost(host: string): Record<string, any> {
    if (isNullOrUndefined(host)) return {};
    let arr = host.split(":");
    let port = "443";
    if (arr.length > 1) port = arr[1];
    if (isNullOrUndefined(profiles[port])) return {};
    return profiles[port];
}
export function validateRequestAndMockResponse(app: any | express.Express) {
    app.all('*', (req: express.Request, res: express.Response) => {
        console.log("hitting: ", req.originalUrl, " with body: ", req.body);
        validateRequest(req, res, getProfileByHost(req.headers.host as string)).then((x) => {
        }).catch(reason => {
            res.status(500).json({ error: reason })
        })
    });
}
