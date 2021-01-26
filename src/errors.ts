


export const ERR_NOT_FOUND = 'Resource Not Found';

export function createErrorBody(msg: string) {
    return {"error": msg};
}