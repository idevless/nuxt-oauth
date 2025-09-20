import { createError } from 'h3'
import { type IOAuthProvider, providerBasicTokenSchema } from '../cores'
import { z } from 'zod'

const providerTokenSchema = providerBasicTokenSchema.extend({
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional()
})

export const feishuProvider: IOAuthProvider = {
  authorizeConstructor: ({ config: { clientId, scopes }, redirectUri, state }) => ({
    endpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
    params: {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes?.join(' '),
      state: state
    }
  }),
  getToken: async ({ config: { clientId, clientSecret }, code, redirectUri }, fetchOptions) => {
    return await $fetch('https://open.feishu.cn/open-apis/authen/v2/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      onResponseError: ({ response }) => {
        throw createError({
          statusCode: 400,
          statusMessage: 'OAUTH_FETCH_TOKEN',
          data: {
            providerName: 'feishu',
            responseData: response._data
          }
        })
      },
      ...fetchOptions
    })
  }
}
