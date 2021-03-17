import * as path from 'path'
import configReader = require('config')
import { logger, mergeDeep } from './utils'

export const SPEC_DIR = 'spec-dir'
export const PROFILES = 'profiles'
export const config: Record<string, any> = {
    [SPEC_DIR]: configReader.get(SPEC_DIR) || path.resolve('../azure-rest-api-specs'),
    [PROFILES]: {
        8441: {
            stateful: true
        },

        8445: {
            alwaysError: 500
        }
    }
}

export function setConfig(name: string, value: any) {
    logger.info(`Config changed: ${name} --> ${value}`)
    config[name] = value
}

if (configReader.has(PROFILES))
    config[PROFILES] = mergeDeep(config[PROFILES], configReader.get(PROFILES))

logger.info('Initial config: ' + JSON.stringify(config, null, 4))
