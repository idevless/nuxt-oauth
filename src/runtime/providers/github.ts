import { type IOAuthProvider, providerBasicTokenSchema } from '../cores'

export const githubProvider: IOAuthProvider = {
  authorizeConstructor: ({ config: { clientId, scopes }, redirectUri, state }) => ({
    endpoint: 'https://github.com/login/oauth/authorize',
    params: {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes?.join(' '),
      state: state
    }
  }),
  getToken: async ({ config: { clientId, clientSecret }, code, redirectUri }, fetchOptions) => {
    return await $fetch('https://github.com/login/oauth/access_token', {
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
      },
      ...fetchOptions
    })
  }
}
