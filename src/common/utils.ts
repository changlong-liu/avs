import * as lodash from 'lodash'
import * as winston from 'winston'

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
    if (typeof message === 'object' && !isNullOrUndefined(message)) {
        message = JSON.stringify(message, null, 4)
    }
    return `${timestamp} [${level}]: ${message}`
})

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), myFormat),
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log/combined.log' })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({}))
}

export function isNullOrUndefined(obj: any) {
    return obj === null || obj === undefined
}

export function replacePropertyValue(
    property: string,
    newVal: any,
    object: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where = (v: any) => {
        return true
    }
): any {
    const newObject = lodash.clone(object)

    lodash.each(object, (val, key) => {
        if (key === property && where(val)) {
            newObject[key] = newVal
        } else if (typeof val === 'object') {
            newObject[key] = replacePropertyValue(property, newVal, val)
        }
    })

    return newObject
}

export function getPureUrl(url: string): string {
    return url?.split('?')[0]
}

export function getPath(pureUrl: string) {
    return pureUrl.split('/').slice(1)
}

export function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item)
}

export function mergeDeep(target: any, ...sources: any[]): any {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeDeep(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return mergeDeep(target, ...sources)
}
