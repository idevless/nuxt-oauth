import { type IOAuthProvider, providerBasicTokenSchema } from '../base'

export const discordProvider: IOAuthProvider = {
  authorizeEndpoint: 'https://discord.com/oauth2/authorize',
  getAuthorizeQueryParams: ({ clientId, redirectUri, scopes, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(' '),
    state: state,
    response_type: 'code'
  }),
  getToken: async (fetchClient, props) => {
    const res = await fetchClient('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        code: props.code,
        redirect_uri: props.redirectUri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${props.clientId}:${props.clientSecret}`).toString(
          'base64'
        )}`
      }
    })
    return providerBasicTokenSchema.parse(res)
  }
}
