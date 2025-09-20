import { type IOAuthProvider, providerBasicTokenSchema } from '../cores'

export const githubProvider: IOAuthProvider = {
  authorizeEndpoint: 'https://github.com/login/oauth/authorize',
  fetchTokenEndpoint: 'https://github.com/login/oauth/access_token',
  getAuthorizeParams: ({ config: { clientId, scopes }, redirectUri, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(' '),
    state: state
  }),
  getFetchTokenOptions: ({ config: { clientId, clientSecret }, code, redirectUri }) => ({
    method: 'POST',
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
}
