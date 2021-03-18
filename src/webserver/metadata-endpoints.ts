import * as express from 'express'
import { logger, setContentTypeAsJson } from '../common/utils'

export function mockMetadataEndpints(app: any | express.Express) {
    app.get('/metadata/endpoints', (req: express.Request, res: express.Response) => {
        logger.info('fetching metadata')

        const ret = {
            galleryEndpoint: '',
            graphEndpoint: 'https://graph.chinacloudapi.cn/',
            // "graphEndpoint": "https://localhost:8443",
            portalEndpoint: '',
            authentication: {
                // "loginEndpoint": "https://localhost:8443", // "https://login.chinacloudapi.cn/",
                loginEndpoint: 'https://login.chinacloudapi.cn/',
                audiences: [
                    // "http://localhost:8081",
                    'https://management.core.chinacloudapi.cn/',
                    'https://management.chinacloudapi.cn/'
                ]
            }
        }

        setContentTypeAsJson(res).json(ret)
    })
}
