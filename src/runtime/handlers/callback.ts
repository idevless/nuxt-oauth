import { ProxyAgent } from 'undici'
import { basicEventHandler, OAuthError, type Promisable } from '../base'
import providers from '../providers'
import { getCookie, getQuery } from 'h3'
import { ofetch } from 'ofetch'
import { type H3Event } from 'h3'

let proxyAgent: ProxyAgent | undefined

export function defineOAuthCallbackHandler(options?: {
  onSuccess: (
    event: H3Event,
    props: {
      tokenData: any
      providerName: string
      state?: string
    }
  ) => Promisable<Record<string, undefined | string> | void>
  onError?: (event: H3Event, error: any) => Promisable<any>
}) {
  return basicEventHandler(async (event, props) => {
    const { code, state } = getQuery(event)
    const { providerName, csrf, proxy, enableProxy, ...rest } = props
    if (proxy && !proxyAgent) {
      proxyAgent = new ProxyAgent(proxy)
    }
    const provider = providers[providerName as keyof typeof providers]
    if (csrf !== 'close' && getCookie(event, 'oauth_state') !== state) {
      throw new OAuthError('state_mismatch')
    }
    const fetchClient = ofetch.create({ dispatcher: enableProxy ? proxyAgent : undefined })
    try {
      const tokenData = await provider.getToken(fetchClient, {
        code,
        ...rest
      })
      return await Promise.resolve(
        options?.onSuccess(event, { tokenData, providerName, state: state as string | undefined })
      )
    } catch (error) {
      throw new OAuthError('fetch_token_error')
    }
  }, options?.onError)
}
