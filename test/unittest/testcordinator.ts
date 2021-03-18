/* eslint-disable @typescript-eslint/no-var-requires */
import * as assert from 'assert'
import * as fs from 'fs'
import * as globby from 'globby'
import * as lodash from 'lodash'
import * as os from 'os'
import * as path from 'path'
import {
    ERROR_UNKNOWN,
    ERR_NOT_FOUND,
    STATUS_CODE_200,
    STATUS_CODE_404,
    createErrorBody
} from '../../src/common/errors'
import { ErrorCodes } from 'oav/dist/lib/util/constants'
import { LiveRequest } from 'oav/dist/lib/liveValidation/operationValidator'
import { LiveValidator, RequestResponsePair } from 'oav/dist/lib/liveValidation/liveValidator'
import { PROFILES, SPEC_DIR, config, setConfig } from '../../src/common/config'
import { VirtualServerRequest, VirtualServerResponse } from '../../src/mid/models'
import {
    genStatefulResponse,
    generateResponse,
    initializeValidator
} from '../../src/mid/cordinator'

const storeAndCompare = (
    pair: RequestResponsePair,
    response: VirtualServerResponse,
    path: string
) => {
    const expected = lodash.cloneDeep(pair)
    pair.liveResponse.statusCode = response.statusCode
    pair.liveResponse.body = response.body
    pair.liveResponse.headers = response.headers

    const newFile = path + '.new'
    fs.writeFileSync(newFile, JSON.stringify(pair, null, 2)) // save new response for trouble shooting
    assert.deepStrictEqual(pair, expected)
    fs.unlinkSync(newFile) // remove the new file if pass the assert
}

const specDir = path.join(__dirname, '../../test/testData/swaggers')
const optionsForTest = {
    directory: specDir
}
setConfig(SPEC_DIR, specDir)
const statefulProfile = {
    stateful: true
}
const statelessProfile = {
    stateful: false
}
const alwaysErrorProfile = {
    alwaysError: 500
}

function mockRequest(req: LiveRequest, protocol = 'https'): VirtualServerRequest {
    return {
        query: req.query,
        url: req.url,
        protocol: protocol,
        method: req.method,
        headers: req.headers,
        body: req.body
    } as VirtualServerRequest
}

function mockDefaultResponse(): VirtualServerResponse {
    return new VirtualServerResponse('500', createErrorBody(500, ERROR_UNKNOWN))
}

describe('Live Validator Initialization', () => {
    const validator = new LiveValidator(optionsForTest)
    beforeAll(async () => {
        await validator.initialize()
    })
    it('should initialize with swagger directory', async () => {
        await initializeValidator(validator)
        const cache = validator.operationSearcher.cache
        assert.strictEqual(true, cache.has('microsoft.apimanagement'))
        assert.strictEqual(true, cache.has('microsoft.media'))
    })
})

describe('generateResponse()', () => {
    const validator = new LiveValidator(optionsForTest)
    beforeAll(async () => {
        await initializeValidator(validator)
    })
    it('validate GET input', async () => {
        const fileName = path.join(__dirname, '..', 'testData', 'payloads', 'valid_input.json')
        const pair: RequestResponsePair = require(fileName)
        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        await generateResponse(validator, request, response, statelessProfile).then(() => {
            assert.strictEqual(response.statusCode, pair.liveResponse.statusCode)
            pair.liveResponse.body = response.body
            pair.liveResponse.headers = response.headers
        })
        await validator.validateLiveRequestResponse(pair)
    })

    it('alwaysError: return 500 even for a valid_input', async () => {
        const fileName = path.join(__dirname, '..', 'testData', 'payloads', 'valid_input.json')
        const pair: RequestResponsePair = require(fileName)
        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        await generateResponse(validator, request, response, alwaysErrorProfile).then(() => {
            assert.strictEqual(response.statusCode, alwaysErrorProfile.alwaysError.toString())
        })
    })

    it('validate DELETE input', async () => {
        const fileName = path.join(
            __dirname,
            '..',
            'testData',
            'payloads',
            'valid_input_delete.json'
        )
        const pair: RequestResponsePair = require(fileName)
        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        await generateResponse(validator, request, response, statelessProfile).then(() => {
            assert.strictEqual(response.statusCode, pair.liveResponse.statusCode)
            storeAndCompare(pair, response, fileName)
            pair.liveResponse.body = response.body
            pair.liveResponse.headers = response.headers
        })
        await validator.validateLiveRequestResponse(pair)
    })

    it('invalidate input', async () => {
        const fileName = path.join(__dirname, '..', 'testData', 'payloads', 'invalidUrl_input.json')
        const pair: RequestResponsePair = require(fileName)
        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        await generateResponse(validator, request, response, statelessProfile).then(() => {
            assert.strictEqual(response.statusCode, pair.liveResponse.statusCode)
            storeAndCompare(pair, response, fileName)
        })
        const result = await validator.validateLiveRequestResponse(pair)
        expect(
            result.requestValidationResult.runtimeException?.code ===
                ErrorCodes.OperationNotFoundInCache.name
        )
        expect(
            result.responseValidationResult.runtimeException?.code ===
                ErrorCodes.OperationNotFoundInCache.name
        )
    })

    it('special rule of GET resourceGroup', async () => {
        const fileName = path.join(
            __dirname,
            '..',
            'testData',
            'payloads',
            'special_resourcegroup.json'
        )
        const pair: RequestResponsePair = require(fileName)
        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        await generateResponse(validator, request, response, statelessProfile).then(() => {
            assert.strictEqual(response.statusCode, pair.liveResponse.statusCode)
            storeAndCompare(pair, response, fileName)
        })
    })

    it('special rule of GET locations', async () => {
        const fileName = path.join(
            __dirname,
            '..',
            'testData',
            'payloads',
            'special_resourcegroup.json'
        )
        const pair: RequestResponsePair = require(fileName)
        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        await generateResponse(validator, request, response, statelessProfile).then(() => {
            assert.strictEqual(response.statusCode, pair.liveResponse.statusCode)
            storeAndCompare(pair, response, fileName)
        })
        await validator.validateLiveRequestResponse(pair)
    })
})

describe('genStatefulResponse()', () => {
    const validator = new LiveValidator(optionsForTest)

    beforeAll(async () => {
        await initializeValidator(validator)
    })

    it('stateful: return 404 for GET even it is a valid_input', async () => {
        const fileName = path.join(__dirname, '..', 'testData', 'payloads', 'valid_input.json')
        const pair: RequestResponsePair = require(fileName)

        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        //await generateResponse(validator, request, response, statelessProfile)

        genStatefulResponse(
            request,
            response,
            { [response.statusCode]: response.body },
            statefulProfile
        )

        expect(response.statusCode === STATUS_CODE_404.toString())
        assert.deepStrictEqual(response.body, createErrorBody(STATUS_CODE_404, ERR_NOT_FOUND))
    })

    it('stateful: return 404 for DELETE even it is a valid_input', async () => {
        const fileName = path.join(
            __dirname,
            '..',
            'testData',
            'payloads',
            'valid_input_delete.json'
        )
        const pair: RequestResponsePair = require(fileName)

        const request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        //await generateResponse(validator, request, response, statelessProfile)

        genStatefulResponse(
            request,
            response,
            { [response.statusCode]: response.body },
            statefulProfile
        )

        expect(response.statusCode === STATUS_CODE_404.toString())
        assert.deepStrictEqual(response.body, createErrorBody(STATUS_CODE_404, ERR_NOT_FOUND))
    })

    it('stateful create->read->delete', async () => {
        // create
        let fileName = path.join(__dirname, '..', 'testData', 'payloads', 'valid_input_create.json')
        let pair: RequestResponsePair = require(fileName)
        let request = mockRequest(pair.liveRequest)
        const response = mockDefaultResponse()
        genStatefulResponse(
            request,
            response,
            { [response.statusCode]: response.body },
            statefulProfile
        )
        expect(response.statusCode === STATUS_CODE_200.toString())

        // read
        fileName = path.join(__dirname, '..', 'testData', 'payloads', 'valid_input.json')
        pair = require(fileName)
        request = mockRequest(pair.liveRequest)
        genStatefulResponse(
            request,
            response,
            { [response.statusCode]: response.body },
            statefulProfile
        )
        expect(response.statusCode === STATUS_CODE_200.toString())

        // delete
        fileName = path.join(__dirname, '..', 'testData', 'payloads', 'valid_input_delete.json')
        pair = require(fileName)
        request = mockRequest(pair.liveRequest)
        genStatefulResponse(
            request,
            response,
            { [response.statusCode]: response.body },
            statefulProfile
        )
        expect(response.statusCode === STATUS_CODE_200.toString())
    })
})
