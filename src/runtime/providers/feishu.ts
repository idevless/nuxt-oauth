import { type IOAuthProvider, providerBasicTokenSchema } from '../base'
import { z } from 'zod'

const providerTokenSchema = providerBasicTokenSchema.extend({
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional()
})

export const feishuProvider: IOAuthProvider = {
  authorizeEndpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
  getAuthorizeQueryParams: ({ clientId, redirectUri, scopes, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes?.join(' '),
    state: state,
    response_type: 'code'
  }),
  getToken: async (fetchClient, props) => {
    const res = await fetchClient('https://open.feishu.cn/open-apis/authen/v2/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        code: props.code,
        redirect_uri: props.redirectUri,
        grant_type: 'authorization_code',
        client_id: props.clientId,
        client_secret: props.clientSecret
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    return providerTokenSchema.parse(res)
  }
}
