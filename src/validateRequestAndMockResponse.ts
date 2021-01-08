import * as express from "express";
import {validateRequest} from "./validator";

export function validateRequestAndMockResponse(app: any | express.Express) {
    app.all('*', (req: express.Request, res: express.Response) => {
        console.log("hitting: ", req.originalUrl, req.body);
        //res.send('Hello World!')
        validateRequest(req, res).then((x)=> {

        }).catch(reason=>{
            res.status(500).json({error: reason})
        })
    });
}
