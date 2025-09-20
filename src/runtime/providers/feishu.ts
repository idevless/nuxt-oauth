import { createError } from 'h3'
import { type IOAuthProvider, providerBasicTokenSchema } from '../cores'
import { z } from 'zod'

const providerTokenSchema = providerBasicTokenSchema.extend({
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional()
})

export const feishuProvider: IOAuthProvider = {
  authorizeEndpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
  fetchTokenEndpoint: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
  getAuthorizeParams: ({ config: { clientId, scopes }, redirectUri, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(' '),
    state: state
  }),
  getFetchTokenOptions: ({ config: { clientId, clientSecret }, code, redirectUri }) => ({
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
    }
  })
}
