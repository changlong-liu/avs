export const STATUS_CODE_200 = 200
export const STATUS_CODE_204 = 204
export const STATUS_CODE_404 = 404
export const STATUS_CODE_500 = 500

export const ERR_NOT_FOUND = 'Resource Not Found'
export const ERROR_INTENTIONAL = 'Intentional Error'

export function createErrorBody(code: any, msg: any) {
    return { error: { code: String(code), message: String(msg) } }
}
