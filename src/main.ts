import bodyParser = require('body-parser');
import express = require('express');
import {mockAuthServer} from "./authserver"
import {mockMetadataEndpints} from "./metadata-endpoints";
import {validateRequestAndMockResponse} from "./validateRequestAndMockResponse";
import {getHttpServer} from "./httpServerConstructor";

function main() {
    let app = express();
    // your express configuration here
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    mockAuthServer(app);
    mockMetadataEndpints(app);
    validateRequestAndMockResponse(app);
    let httpsServer = getHttpServer(app);
    httpsServer.listen(443, '0.0.0.0', function () {
        console.log("Listening https on port: 443")
    });
}

main();
