import * as lodash from 'lodash'
import { LiveValidator, LiveValidationResult } from 'oav/dist/lib/liveValidation/liveValidator'
import {
    LiveRequest,
    LiveResponse,
    ValidationRequest
} from 'oav/dist/lib/liveValidation/operationValidator'
import { OperationSearcher, OperationMatch } from 'oav/dist/lib/liveValidation/operationSearcher'
import * as Constants from 'oav/dist/lib/util/constants'
import { specRepoDir } from '../common/config'
import { generate } from './responser'
import { ResourcePool } from './resource'
import { isNullOrUndefined, replacePropertyValue, getPureUrl, getPath } from '../common/utils'
import http = require('http')
import {
    createErrorBody,
    ERR_NOT_FOUND,
    STATUS_CODE_404,
    ERROR_INTENTIONAL
} from '../common/errors'
import express = require('express')
import { get_locations } from './specials'

const options = {
    swaggerPaths: [],
    excludedSwaggerPathsPattern: Constants.DefaultConfig.ExcludedSwaggerPathsPattern,
    git: {
        url: 'https://github.com/Azure/oav.git',
        shouldClone: false
    },
    // directory: path.resolve(os.homedir(), "repo"),
    directory: specRepoDir
}

const validator = new LiveValidator(options)
;(async () => {
    await validator.initialize()
    console.log('validator initialized')
})()

function findResponse(responses: Record<string, any>, status: number) {
    let nearest = undefined
    for (const code in responses) {
        if (
            nearest === undefined ||
            Math.abs(nearest - status) > Math.abs(parseInt(code) - status)
        ) {
            nearest = parseInt(code)
        }
    }
    return nearest ? responses[nearest.toString()] : {}
}

function search(
    searcher: OperationSearcher,
    info: ValidationRequest
): {
    operationMatch: OperationMatch
    apiVersion: string
} {
    const requestInfo = { ...info }
    const searchOperation = () => {
        const operations = searcher.getPotentialOperations(requestInfo)
        return operations
    }
    let potentialOperations = searchOperation()
    const firstReason = potentialOperations.reason

    if (potentialOperations?.matches.length === 0) {
        requestInfo.apiVersion = Constants.unknownApiVersion
        potentialOperations = searchOperation()
    }

    if (potentialOperations.matches.length === 0) {
        throw firstReason ?? potentialOperations.reason
    }

    return {
        operationMatch: potentialOperations.matches[0],
        apiVersion: potentialOperations.apiVersion
    }
}

export async function validateRequest(
    req: express.Request,
    res: express.Response,
    profile: Record<string, any>
): Promise<void> {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    const liveRequest = {
        url: fullUrl,
        method: req.method,
        headers: req.headers as any,
        query: req.query as any,
        body: req.body
    }

    const validationRequest = validator.parseValidationRequest(
        liveRequest.url,
        liveRequest.method,
        ''
    )
    const validateResult = await validator.validateLiveRequest(liveRequest)

    if (
        validateResult.isSuccessful ||
        validateResult.runtimeException?.code == Constants.ErrorCodes.MultipleOperationsFound.name
    ) {
        const result = search(validator.operationSearcher, validationRequest)
        // console.log("operation: ", result);
        const operationId = result.operationMatch.operation.operationId as string
        const specItem = {
            content: result.operationMatch.operation
        }
        const example = await generate(specItem)
        if (profile?.alwayError) {
            res.status(STATUS_CODE_404).json(createErrorBody(profile.alwayError, ERROR_INTENTIONAL))
            return
        }
        genStatefulResponse(req, res, example.responses, profile)
    } else {
        const exampleResponse = handleSpecials(req, res, validationRequest)
        if (exampleResponse == undefined) {
            if ((validateResult.errors?.length || 0) > 0) {
                res.status(STATUS_CODE_404).json(
                    createErrorBody(STATUS_CODE_404, JSON.stringify(validateResult.errors))
                )
            } else {
                res.status(STATUS_CODE_404).json(validateResult.runtimeException)
            }
        } else {
            genStatefulResponse(req, res, exampleResponse, profile)
        }
    }
}

export function handleSpecials(
    req: express.Request,
    res: express.Response,
    validationRequest: ValidationRequest
): Record<string, any> | undefined {
    if (validationRequest.providerNamespace == 'microsoft.unknown') {
        const path = getPath(getPureUrl(req.url))
        if (path.length == 4 && path[2].toLowerCase() == 'resourcegroups') {
            // handle "/subscriptions/xxx/resourceGroups/xxx"
            return {
                '200': {
                    body: {
                        id: getPureUrl(req.url),
                        location: 'eastus',
                        managedBy: null,
                        name: path[3],
                        properties: {
                            provisioningState: 'Succeeded'
                        },
                        tags: {},
                        type: 'Microsoft.Resources/resourceGroups'
                    }
                }
            }
        }
        if (path.length == 3 && path[2].toLowerCase() == 'locations') {
            return {
                200: replacePropertyValue(
                    '0000000-0000-0000-0000-000000000000',
                    path[1],
                    get_locations
                )
            }
        }
    }
    return undefined
}

export function genStatefulResponse(
    req: express.Request,
    res: express.Response,
    exampleResponses: Record<string, any>,
    profile: Record<string, any>
) {
    if (
        profile?.stateful &&
        ['GET', 'DELETE'].indexOf(req.method.toUpperCase()) >= 0 &&
        !ResourcePool.isListUrl(req) &&
        !resourcePool.hasUrl(req)
    ) {
        res.status(STATUS_CODE_404).json(createErrorBody(STATUS_CODE_404, ERR_NOT_FOUND))
    } else {
        resourcePool.updateResourcePool(req)
        let ret = findResponse(exampleResponses, 200).body

        // simplified LRO
        ret = lodash.omit(ret, 'nextLink')
        ret = replacePropertyValue('provisioningState', 'Succeeded', ret)

        //set name
        const path = getPath(getPureUrl(req.url))
        ret = replacePropertyValue('name', path[path.length - 1], ret, (v) => {
            return typeof v === 'string'
        })

        res.status(200).json(ret)
    }
}

const resourcePool = new ResourcePool()
