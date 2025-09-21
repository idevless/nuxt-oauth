import { createError } from 'h3'
import { type IOAuthProviderDefination } from './_base'
import { z } from 'zod'

export const feishuTokenDataSchema = z.object({
  access_token: z.string().default('bearer'),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional(),
  scope: z.string()
})

export const feishuUserInfoSchema = z.object({
  user_id: z.string().optional(),
  open_id: z.string(),
  union_id: z.string(),
  tenant_key: z.string(),
  name: z.string(),
  enterprise_email: z.string().optional(),
  en_name: z.string().optional(),
  enterprise_no: z.string().optional(),
  email: z.string().optional(),
  avatar_url: z.string(),
  avatar_thumb: z.string(),
  avatar_middle: z.string(),
  avatar_big: z.string(),
  mobile: z.string().optional()
})

export const feishuProvider: IOAuthProviderDefination = {
  authorizeEndpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
  fetchTokenEndpoint: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
  getAuthorizeParams: ({ config: { clientId, scope }, redirectUri, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
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
  }),
  fetchUserInfo: async ({ accessToken, ...options }) => {
    const res = await $fetch<{ code: number; data: any }>(
      `https://open.feishu.cn/open-apis/authen/v1/user_info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        ...options
      }
    )
    return res.data
  }
}
