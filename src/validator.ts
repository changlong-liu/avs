import * as os from "os";
import * as path from "path";
import * as globby from "globby";
import * as lodash from "lodash";
import { ResponsesObject } from "yasway";
import { LiveValidator, LiveValidationResult } from "oav/dist/lib/liveValidation/liveValidator";
import { LiveRequest, LiveResponse } from "oav/dist/lib/liveValidation/operationValidator"
import { OperationSearcher } from "oav/lib/liveValidation/operationSearcher";
import * as Constants from "oav/dist/lib/util/constants";
import http = require('http')
import { createErrorBody, ERR_NOT_FOUND } from './errors';


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
    if (nearest === undefined || Math.abs(nearest - status) > Math.abs(parseInt(code) - status)) {
      nearest = parseInt(code);
    }
  }
  return nearest ? responses[nearest.toString()] : {};
}

export async function validateRequest(req: express.Request, res: express.Response): Promise<void> {

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
  if (validationRequest.providerNamespace == "microsoft.unknown" && req.originalUrl.split("/").length == 5) {
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
  // console.log("operation: ", result);
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
    genStatefulResponse(req, res, example.responses);
  }
  else {
    res.status(404).json(validateResult.errors[0]);
  }
}

export function genStatefulResponse(req: express.Request, res: express.Response, exampleResponses: Record<string, any>) {
  if (req.method == 'GET' && !resourcePool.hasUrl(req)) {
    res.status(404).json(createErrorBody(ERR_NOT_FOUND));
  }
  else {
    resourcePool.updateResourcePool(req);
    let ret = findResponse(exampleResponses, 200).body;
    ret = lodash.omit(ret, 'nextLink')
    ret = replacePropertyValue("provisioningState", "Succeeded", ret)
    res.status(200).json(ret);
  }
}

class ResourceNode {
  public children: Record<string, ResourceNode>;
  constructor(public name?: string, public url?: string, public body?: string) {
    this.children = {};
  }
}
class ResourcePool {
  public resourceRoot: ResourceNode;
  constructor() {
    this.resourceRoot = new ResourceNode();
  }

  public updateResourcePool(req: express.Request) {
    const url = req.url?.split('?')[0];
    const path = url.split('/').slice(1);
    if (req.method == 'PUT') {
      ResourcePool.addResource(this.resourceRoot, path, req.url, path[path.length - 1], req.body)
    }
    if (req.method == 'DELETE') {
      ResourcePool.deleteResource(this.resourceRoot, path);
    }
  }

  public static addResource(node: ResourceNode, path: string[], url: string, name: string, body: any) {
    if (path.length == 0) {
      node.url = url;
      node.name = name;
      node.body = body;
      return;
    };
    const _name = path[0].toLowerCase();
    if (!(_name in node.children)) {
      node.children[_name] = new ResourceNode();
    }
    ResourcePool.addResource(node.children[_name], path.slice(1), url, name, body);
  }

  public hasUrl(req: express.Request): boolean {
    const url: string = req.url?.split('?')[0] as string;
    return !isNullOrUndefined(ResourcePool.getResource(this.resourceRoot, url.split('/').slice(1)));
  }

  public static getResource(node: ResourceNode, path: string[]): ResourceNode|undefined {
    if (path.length == 0) return node;
    const name = path[0].toLowerCase()
    if (name in node.children) return ResourcePool.getResource(node.children[name], path.slice(1));
    return undefined;
  }

  public static deleteResource(node: ResourceNode, path: string[]) {
    if (path.length == 0) return;
    const name = path[0].toLowerCase();
    if (name in node.children) {
      if (path.length == 1) {
        delete node.children[name];
      }
      else {
        ResourcePool.deleteResource(node.children[name], path.slice(1));
      }
    }
  }
}

let resourcePool = new ResourcePool();

function replacePropertyValue(property: string, newVal: any, object: any) {
  const newObject = lodash.clone(object);

  lodash.each(object, (val, key) => {
    if (key === property) {
      newObject[key] = newVal;
    } else if (typeof (val) === 'object') {
      newObject[key] = replacePropertyValue(property, newVal, val);
    }
  });

  return newObject;
}

import ExampleGenerator from "oav/dist/lib/generator/exampleGenerator";

import { JsonLoader } from "oav/dist/lib/swagger/jsonLoader";
import { Operation, SwaggerSpec } from "oav/dist/lib/swagger/swaggerTypes";
import SwaggerMocker from "oav/dist/lib/generator/swaggerMocker";
import { MockerCache, PayloadCache } from "oav/dist/lib/generator/exampleCache";
import { isNullOrUndefined } from "util";

let jsonLoader = JsonLoader.create({});
let mockerCache = new MockerCache();
let payloadCache = new PayloadCache();
let swaggerMocker = new SwaggerMocker(jsonLoader, mockerCache, payloadCache);

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

async function generate(genrator: ExampleGenerator,
  specItem: any,
  operationId: string,
) {
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
