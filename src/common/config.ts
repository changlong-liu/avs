import * as path from 'path';
import config = require('config');
import { mergeDeep } from './utils';

const SPEC_DIR = 'spec-dir';
export const specRepoDir: string = config.get(SPEC_DIR) || path.resolve('../azure-rest-api-specs');

const PROFILES = 'profiles';
export let profiles: Record<string, any> = {
    '443': {
        stateful: true,
    },
};
if (config.has(PROFILES)) profiles = mergeDeep(profiles, config.get(PROFILES));
