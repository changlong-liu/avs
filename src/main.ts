import bodyParser = require('body-parser');
import express = require('express');
import {mockAuthServer} from "./authserver"
import {mockMetadataEndpints} from "./metadata-endpoints";
import {validateRequestAndMockResponse} from "./validateRequestAndMockResponse";
import {getHttpsServer, getHttpServer} from "./httpServerConstructor";

function main() {
    let app = express();
    // your express configuration here
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    mockAuthServer(app);
    mockMetadataEndpints(app);
    validateRequestAndMockResponse(app);
    let httpsServer = getHttpsServer(app);
    httpsServer.listen(443, '0.0.0.0', function () {
        console.log("Listening https on port: 443")
    });
    let httpServer = getHttpServer(app);
    httpServer.listen(80, '0.0.0.0', function () {
      console.log("Listening https on port: 80")
    });

    let statelessServer = getHttpsServer(app);
    statelessServer.listen(8443, '0.0.0.0', function () {
      console.log("Listening https on port: 8443")
  });
}

main();
