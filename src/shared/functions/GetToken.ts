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
