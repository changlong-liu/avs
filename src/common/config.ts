import * as path from 'path'
import config = require('config')
import { logger, mergeDeep } from './utils'

const SPEC_DIR = 'spec-dir'
export const specRepoDir: string = config.get(SPEC_DIR) || path.resolve('../azure-rest-api-specs')

const PROFILES = 'profiles'

export let profiles: Record<string, any> = {
    8441: {
        stateful: true
    },

    8445: {
        alwayError: 500
    }
}
logger.info('Start with profiles: ' + JSON.stringify(profiles, null, 4))
if (config.has(PROFILES)) profiles = mergeDeep(profiles, config.get(PROFILES))
