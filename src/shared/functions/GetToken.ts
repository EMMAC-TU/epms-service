/**
 * Gets the token from an authorization header
 * @param authHeader The Authorization Header
 * @returns The token if it exists
 */
export function getToken(authHeader: string) {
    const [type, token] = authHeader? authHeader.split(' ') : [null, null];
    if (
        type.toLowerCase() === 'bearer' &&
        token &&
        token !== 'null' &&
        token !== 'undefinded'
    ) {
        return token;
    }
}
