
import * as lodash from "lodash";

export function isNullOrUndefined(obj: any) {
    return obj === null || obj === undefined;
}

export function replacePropertyValue(property: string, newVal: any, object: any, where = (v: any) => { return true; }) {
    const newObject = lodash.clone(object);

    lodash.each(object, (val, key) => {
        if (key === property && where(val)) {
            newObject[key] = newVal;
        } else if (typeof (val) === 'object') {
            newObject[key] = replacePropertyValue(property, newVal, val);
        }
    });

    return newObject;
}

export function getPureUrl(url: string) {
    return url?.split('?')[0];
}

export function getPath(pureUrl: string) {
    return pureUrl.split('/').slice(1);
}
