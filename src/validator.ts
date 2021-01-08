import * as os from "os";
import * as path from "path";
import * as globby from "globby";
import * as lodash from "lodash";
import { ResponsesObject } from "yasway";
import { LiveValidator,LiveValidationResult } from  "oav/dist/lib/liveValidation/liveValidator";
import { LiveRequest, LiveResponse} from "oav/dist/lib/liveValidation/operationValidator"
import { OperationSearcher } from "oav/lib/liveValidation/operationSearcher";
import * as Constants from "oav/dist/lib/util/constants";
import http = require('http')


import express = require('express');
import { Response } from "oauth2-server";
var app = express();

const specRepoDir = path.resolve("../azure-rest-api-specs")
app.all('', (req, res) => {
    let liveRequest = {
        url: "https://xxx.com/providers/someprovider?api-version=2018-01-01",
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        query: {
          "api-version": "2016-01-01",
        },
      }
})
const options = {
  swaggerPaths: [],
  excludedSwaggerPathsPattern: Constants.DefaultConfig.ExcludedSwaggerPathsPattern,
  git: {
    url: "https://github.com/Azure/oav.git",
    shouldClone: false,
  },
  // directory: path.resolve(os.homedir(), "repo"),
  directory: specRepoDir
};

const validator = new LiveValidator(options);
(async () => {
  await validator.initialize();
  console.log("validator initialized");
})()

function findResponse(responses: Record<string, any>, status: number) {
  let nearest = undefined;
  for (let code in responses) {
    if (nearest === undefined || Math.abs(nearest-status)>Math.abs(parseInt(code)-status)) {
      nearest = parseInt(code);
    }
  }
  return nearest?responses[nearest.toString()]: {};
}

export async function validateRequest(req: any, res: any): Promise<void> {

      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      const reqBody = req.read()
      let liveRequest = {
        url: fullUrl,
        method: req.method,
        headers: req.headers as any,
        query: req.query as any,
        body: req.body,
      }

      const validationRequest = validator.parseValidationRequest(
        liveRequest.url,
        liveRequest.method,
        ''
      );
      if (validationRequest.providerNamespace == "microsoft.unknown" && req.originalUrl.split("/").length==5) {
        res.status(200).json(
          {
            "id": "/subscriptions/7fd08dcc-a653-4b0f-8f8c-4dac889fdda4/resourceGroups/test-changlong",
            "location": "eastus",
            "managedBy": null,
            "name": "test-changlong",
            "properties": {
              "provisioningState": "Succeeded"
            },
            "tags": {},
            "type": "Microsoft.Resources/resourceGroups"
          }
        );
        return;
      }
      const result = validator.operationSearcher.search(validationRequest);
      console.log("operation: ", result);
      const operationId = result.operationMatch.operation.operationId as string;
      const specItem = {
          content: result.operationMatch.operation
      }
      let generator = new ExampleGenerator(
        specRepoDir//,
        //path.resolve(payloadDir, rp + apiVersion)
      );
      let example = await generate(generator, specItem, operationId);


      let validateResult = await validator.validateLiveRequest(liveRequest);

      if (validateResult.isSuccessful) {
        let ret = findResponse(example.responses, 200).body;
        ret = lodash.omit(ret,'nextLink')
        res.status(200).json(ret);
      }
      else {
        res.status(404).json(validateResult.errors[0]);
      }
}

import * as fs from "fs";

import ExampleGenerator from "oav/dist/lib/generator/exampleGenerator";
import { ModelValidationError } from "oav/dist/lib/util/modelValidationError";

export async function generateResponse(operationId: string) {
    const specFilePaths = getSpecFilePaths(specRepoDir);
  for (const specPath of specFilePaths) {
    const specInfo = specPath.split("/");
    const apiVersion = specInfo[specInfo.length - 2];
    const rp = specInfo[specInfo.length - 1].split(".")[0];

    let generator = new ExampleGenerator(
        specPath//,
        //path.resolve(payloadDir, rp + apiVersion)
      );
    const errors: readonly ModelValidationError[] = await generator.generate(operationId);
      if (errors.length > 0) {
        console.error(errors);
      }
      return errors.length;
  }
}


export function getSpecFilePaths(repoDir: string) {
  const rpList = fs.readdirSync(path.resolve(repoDir, "specification"));

  const specPath: string[] = [];
  rpList.forEach((rp: string) => {
    if (!fs.existsSync(path.resolve(repoDir, "specification", rp, "resource-manager"))) {
      return;
    }
    const fullRps = fs
      .readdirSync(path.resolve(repoDir, "specification", rp, "resource-manager"))
      .filter((s) => s.startsWith("Microsoft."));
    if (fullRps.length !== 1) {
      return;
    }
    const stablePath = path.resolve(
      repoDir,
      "specification",
      rp,
      "resource-manager",
      fullRps[0],
      "stable"
    );
    if (!fs.existsSync(stablePath)) {
      return;
    }
    const versions = fs.readdirSync(stablePath).sort((i, j) => j.localeCompare(i));
    if (versions.length === 0) {
      return;
    }
    const filePath = path.resolve(stablePath, versions[0], `${rp}.json`);
    if (!fs.existsSync(filePath)) {
      return;
    }
    specPath.push(filePath);
  });
  return specPath;
}


import { JsonLoader } from "oav/dist/lib/swagger/jsonLoader";
import { Operation, SwaggerSpec } from "oav/dist/lib/swagger/swaggerTypes";
import SwaggerMocker from "oav/dist/lib/generator/swaggerMocker";
import { MockerCache, PayloadCache } from "oav/dist/lib/generator/exampleCache";

let jsonLoader = JsonLoader.create({});
let mockerCache = new MockerCache();
let swaggerMocker = new SwaggerMocker(jsonLoader, mockerCache);

function getSpecItem(spec: any, operationId: string): any {
  const paths = spec.paths;
  for (const pathName of Object.keys(paths)) {
    for (const methodName of Object.keys(paths[pathName])) {
      if (paths[pathName][methodName].operationId === operationId) {
        return {
          path: pathName,
          methodName,
          content: paths[pathName][methodName],
        };
      }
    }
  }
  return null;
}

async function  generate(genrator: ExampleGenerator,
    specItem: any,
    operationId: string,  
  ){
    let spec = (await (jsonLoader.load(path.join(specRepoDir, specItem.content._path._spec._filePath)) as unknown)) as SwaggerSpec;

      specItem = getSpecItem(spec, operationId);

    let example = {
      responses: {},
      parameters: {}
    };
    swaggerMocker.mockForExample(
        example,
        specItem,
        spec,
        'unknown'
      );
      console.log(example);
    return example;
}
