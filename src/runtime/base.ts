import { z } from 'zod'
import { ofetch, type $fetch } from 'ofetch'
import { type H3Event, eventHandler, getRequestURL, getRouterParam, sendRedirect } from 'h3'
import { useRuntimeConfig } from '#imports'
import { withQuery } from 'ufo'

export type Promisable<T> = T | Promise<T>

export const supportedProviderEnum = z.enum(['feishu', 'discord', 'github'])

export type TSupportedProviderNames = z.infer<typeof supportedProviderEnum>

export const providerConfigSchema = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  scopes: z.array(z.string()).optional(),
  enabledProxy: z.boolean().default(false).describe('在请求该提供商的接口时，是否使用代理访问')
})

export type TProviderConfig = Required<z.infer<typeof providerConfigSchema>>
export type TProviderBasicConfigInput = Partial<z.input<typeof providerConfigSchema>>

export const providerBasicTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  scope: z.string().optional()
})

export type TProviderBasicToken = z.infer<typeof providerBasicTokenSchema>

export type TProviderBasicTokenInput = z.input<typeof providerBasicTokenSchema>

export const oauthConfigSchema = z.object({
  callbackPath: z
    .string()
    .default('/')
    .describe('EventHandler处理结束后，重定向的路径, 默认会通过查询参数，携带处理结果'),
  proxy: z.string().optional().describe('默认自动检测系统代理，此选项可以覆盖默认的代理配置'),
  csrf: z
    .enum(['strict', 'auto', 'close'])
    .default('auto')
    .describe(
      'strict: 强制HTTPS请求环境(推荐在生产环境下使用), auto: 自动检测是否为HTTPS环境(推荐在开发环境下使用), close: 关闭CSRF保护(不推荐)'
    )
})

export type TOAuthConfig = z.infer<typeof oauthConfigSchema>

export type TOAuthConfigInput = Partial<z.input<typeof oauthConfigSchema>>

export interface IOAuthProvider<TToken = TProviderBasicToken> {
  authorizeEndpoint: string
  getAuthorizeQueryParams?: (
    props: Omit<TProviderConfig, 'clientSecret' | 'enabledProxy'> & {
      redirectUri: string
      state?: string
    }
  ) => Record<string, string | undefined>
  getToken: (
    fetchClient: typeof ofetch,
    props: Omit<TProviderConfig, 'enabledProxy'> & {
      redirectUri: string
      code: string
    }
  ) => Promisable<TToken>
}

export class OAuthError extends Error {
  code: string
  constructor(code: string) {
    super('OAuth Hanlder Error')
    this.code = code
  }
}

export function basicEventHandler(
  handler: (event: H3Event, props: any) => Promisable<any>,
  onError?: any
) {
  return eventHandler(async (event: H3Event) => {
    const { providers, callbackPath, ...config } = useRuntimeConfig(event).oauth!
    const providerName = getRouterParam(event, 'provider')
    if (!providerName) {
      return await sendRedirect(
        event,
        withQuery(callbackPath!, {
          status: 'error',
          error: 'route_parameter_missing',
          provider: providerName
        })
      )
    } else if (!Object.keys(providers!).includes(providerName)) {
      return await sendRedirect(
        event,
        withQuery(callbackPath!, {
          status: 'error',
          error: 'provider_not_configured',
          provider: providerName
        })
      )
    } else {
      const { origin, protocol } = getRequestURL(event)
      const redirectUri = `${origin}/oauth/callback/${providerName}`
      Object.assign(config, providers![providerName]!, {
        providerName,
        redirectUri,
        requestProtocol: protocol
      })
    }
    try {
      return await Promise.resolve(handler(event, config))
    } catch (error) {
      if (onError) {
        await Promise.resolve(onError(event, error))
      }
      if (error instanceof OAuthError) {
        return await sendRedirect(
          event,
          withQuery(callbackPath!, {
            status: 'error',
            error: error.code,
            provider: providerName
          })
        )
      } else {
        return await sendRedirect(
          event,
          withQuery(callbackPath!, {
            status: 'error',
            error: 'unknown_error',
            provider: providerName
          })
        )
      }
    }
  })
}
