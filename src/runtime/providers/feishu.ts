import type { BaseProviderDefinition } from './_types'
import { z } from 'zod'

export const feishuUserInfoSchema = z.object({
  user_id: z.string(),
  open_id: z.string(),
  union_id: z.string(),
  name: z.string().optional(),
  en_name: z.string().optional(),
  avatar_url: z.url(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  tenent_key: z.string().optional(),
  enterprise_email: z.string().optional(),
  employee_no: z.string().optional()
})

export const feishuTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional(),
  scope: z.string()
})

export const feishuProviderDefinition: BaseProviderDefinition<
  z.infer<typeof feishuUserInfoSchema>,
  z.infer<typeof feishuTokenSchema>
> = {
  authorizeEndpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
  tokenData: {
    request: {
      method: 'POST',
      endpoint: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      extraParams: {
        grant_type: 'authorization_code'
      }
    },
    resolver: feishuTokenSchema.parse
  },
  userInfo: {
    request: {
      endpoint: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      method: 'GET'
    },
    resolver: (res) => feishuUserInfoSchema.parse(res.data)
  }
}
