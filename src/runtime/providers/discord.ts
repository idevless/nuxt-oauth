import { type IOAuthProvider, providerBasicTokenSchema } from '../cores'

export const discordProvider: IOAuthProvider = {
  authorizeConstructor: ({ config: { clientId, scopes }, redirectUri, state }) => ({
    endpoint: 'https://discord.com/oauth2/authorize',
    params: {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes?.join(' '),
      state: state,
      response_type: 'code'
    }
  }),
  getToken: async ({ config: { clientId, clientSecret }, code, redirectUri }, fetchOptions) => {
    return await $fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      ...fetchOptions
    })
  }
}
