import { z } from 'zod'

export const providerConfigSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  scopes: z.array(z.string()).default([])
})

export const providerBasicTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  scope: z.string().optional()
})

export const oauthConfigSchema = z.object({
  csrf: z
    .enum(['strict', 'auto', 'close'])
    .default('auto')
    .describe(
      'strict: 强制HTTPS请求环境(推荐在生产环境下使用), auto: 自动检测是否为HTTPS环境(推荐在开发环境下使用), close: 关闭CSRF保护(不推荐)'
    )
})
