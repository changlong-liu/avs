import * as path from 'path'
import { JsonLoader } from 'oav/dist/lib/swagger/jsonLoader'
import { Operation, SwaggerSpec } from 'oav/dist/lib/swagger/swaggerTypes'
import SwaggerMocker from 'oav/dist/lib/generator/swaggerMocker'
import { MockerCache, PayloadCache } from 'oav/dist/lib/generator/exampleCache'
import { isNullOrUndefined } from '../common/utils'
import { specRepoDir } from '../common/config'
import { OperationInfo } from 'oav/dist/lib/models'
import * as fs from 'fs'

const jsonLoader = JsonLoader.create({})
const mockerCache = new MockerCache()
const payloadCache = new PayloadCache()
const swaggerMocker = new SwaggerMocker(jsonLoader, mockerCache, payloadCache)

function getSpecItem(spec: any, operationId: string): any {
    const paths = spec.paths
    for (const pathName of Object.keys(paths)) {
        for (const methodName of Object.keys(paths[pathName])) {
            if (paths[pathName][methodName].operationId === operationId) {
                const ret = {
                    path: pathName,
                    methodName,
                    content: paths[pathName][methodName]
                }

                if (isNullOrUndefined(ret.content.parameters)) {
                    ret.content.parameters = []
                }
                if (paths[pathName].parameters) {
                    ret.content.parameters.push(...paths[pathName].parameters)
                }
                return ret
            }
        }
    }
    return null
}

export class SpecItem {
    public content: Operation = {} as Operation
}

export function getSpecFileByOperation(operation: Operation): string {
    return path.join(specRepoDir, operation._path._spec._filePath)
}

export function getFullSpecBySpecItem(operation: Operation) {
    const fileName = getSpecFileByOperation(operation)
    return JSON.parse(fs.readFileSync(fileName, 'utf8'))
}

export async function generate(specItem: SpecItem) {
    const specFile = getSpecFileByOperation(specItem.content)
    const spec = (await (jsonLoader.load(specFile) as unknown)) as SwaggerSpec
    const allExamples = getExamples(specItem.content)

    specItem = getSpecItem(spec, specItem.content.operationId as string)

    const example = {
        responses: {},
        parameters: {}
    }
    swaggerMocker.mockForExample(example, specItem, spec, 'unknown')
    console.log(JSON.stringify(example))
    return example
}

export class Example {
    public parameters: Record<string, any> = {}
    public responses: Record<string, any> = {}
}
export function getExamples(operation: Operation): Example[] {
    const ret: Example[] = []
    const fullSpec = getFullSpecBySpecItem(operation)

    return ret
}
