
const authenticate =  async (z, bundle) => {
    const authBody = {
        username: `${bundle.authData.username}`,
        password: `${bundle.authData.password}`,
        account_id: `${bundle.authData.accountId}`,
        token_expiry_in_minutes: 6000000,
        refresh_token_expiry_in_minutes: 100000
    }
    const requestOptions = {
        url: `${sanitizeUrl(bundle.authData.gatewayUrl)}/auth/authenticate`,
        method: 'POST',
        body: authBody
    }
    const response = await z.request(requestOptions);
    return response.data;
}
const refreshToken =  async (z, bundle) => {
    if (bundle.inputData.jwt_refresh_token) {
        const authBody = {
            jwt_refresh_token: `${bundle.inputData.jwt_refresh_token}`,
            token_expiry_in_minutes: 6000000,
            refresh_token_expiry_in_minutes: 100000
        }
        const requestOptions = {
            url: `${sanitizeUrl(bundle.authData.gatewayUrl)}/auth/refreshToken`,
            method: 'POST',
            body: authBody
        }
        try {
            const response = await z.request(requestOptions);
            if (response.status === 200) {
                return response.data;
            }
        } catch (e) {
            console.log(e);
        }
    }
    return authenticate(z, bundle);
}

const sanitizeUrl = (url) => {
    return url.slice(-1) === '/' ? url.substring(0, url.length-1) : url;
}

module.exports = {
    authenticate,
    refreshToken,
    sanitizeUrl
};