import { type IOAuthProvider, providerBasicTokenSchema } from '../base'

export const githubProvider: IOAuthProvider = {
  authorizeEndpoint: 'https://github.com/login/oauth/authorize',
  getAuthorizeQueryParams: ({ clientId, redirectUri, scopes, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(' '),
    state: state
  }),
  getToken: async (fetchClient, props) => {
    const res = await fetchClient('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        code: props.code,
        redirect_uri: props.redirectUri
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    return providerBasicTokenSchema.parse(res)
  }
}
