
import * as path from "path";
import ExampleGenerator from "oav/dist/lib/generator/exampleGenerator";
import { JsonLoader } from "oav/dist/lib/swagger/jsonLoader";
import { Operation, SwaggerSpec } from "oav/dist/lib/swagger/swaggerTypes";
import SwaggerMocker from "oav/dist/lib/generator/swaggerMocker";
import { MockerCache, PayloadCache } from "oav/dist/lib/generator/exampleCache";
import { isNullOrUndefined } from "../common/utils";
import {specRepoDir} from "../common/config"

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

export async function generate(genrator: ExampleGenerator,
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
  console.log(JSON.stringify(example));
  return example;
}
