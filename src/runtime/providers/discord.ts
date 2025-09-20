import { type IOAuthProvider, providerBasicTokenSchema } from '../cores'

export const discordProvider: IOAuthProvider = {
  authorizeEndpoint: 'https://discord.com/oauth2/authorize',
  fetchTokenEndpoint: 'https://discord.com/api/oauth2/token',
  getAuthorizeParams: ({ config: { clientId, scopes }, redirectUri, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(' '),
    state: state,
    response_type: 'code'
  }),
  getFetchTokenOptions: ({ config: { clientId, clientSecret }, code, redirectUri }) => ({
    method: 'POST',
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    }
  })
}
