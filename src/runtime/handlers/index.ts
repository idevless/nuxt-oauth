import {
  type H3Event,
  createError,
  eventHandler,
  getCookie,
  getQuery,
  getRequestURL,
  sendRedirect,
  setCookie,
  deleteCookie
} from 'h3'
import { withQuery } from 'ufo'
import { getProviderName, parseRuntimeConfig, getRedirectUri } from './utils'
import providers from '../providers'
import { randomUUID } from 'crypto'
import { type Promisable } from '../cores'

export function defineOAuthGatewayHandler(props?: { providerNameFrom?: 'query' | 'route-param' }) {
  return eventHandler(async (event) => {
    setCookie(event, 'oauth_callback_url', (getQuery(event).callbackUrl as string) ?? '/', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 600
    })
    const providerName = getProviderName(event, props?.providerNameFrom ?? 'query')
    const {
      providerConfig,
      oauthConfig: { stateSecure }
    } = parseRuntimeConfig(event, providerName)
    const { authorizeEndpoint, getAuthorizeParams } = providers[providerName]
    if (!authorizeEndpoint || !getAuthorizeParams) {
      throw createError({
        statusCode: 500,
        statusMessage: `OAUTH_MODULE_ERROR`,
        data: {
          providerName
        }
      })
    }
    const state = randomUUID()
    setCookie(event, 'oauth_state', state, {
      httpOnly: stateSecure,
      secure: stateSecure,
      sameSite: 'lax',
      maxAge: 600
    })

    return await sendRedirect(
      event,
      withQuery(
        authorizeEndpoint,
        getAuthorizeParams({
          config: providerConfig,
          redirectUri: getRedirectUri(event, providerName),
          state
        })
      )
    )
  })
}

export function defineOAuthCallbackHandler(
  handler?: (
    event: H3Event,
    props: { tokenData: any; providerName: string; state?: string; callbackUrl?: string }
  ) => Promisable<void>
) {
  return eventHandler(async (event) => {
    const providerName = getProviderName(event, 'route-param')
    const {
      providerConfig,
      oauthConfig: { csrf }
    } = parseRuntimeConfig(event, providerName)
    const { fetchTokenEndpoint, getFetchTokenOptions } = providers[providerName]
    if (!fetchTokenEndpoint || !getFetchTokenOptions) {
      throw createError({
        statusCode: 500,
        statusMessage: `OAUTH_MODULE_ERROR`,
        data: {
          providerName
        }
      })
    }
    const cookieState = getCookie(event, 'oauth_state')
    const { code, state: queryState } = getQuery(event)
    deleteCookie(event, 'oauth_state')
    if (csrf !== 'close' && cookieState !== queryState) {
      throw createError({
        statusCode: 400,
        statusMessage: 'OAUTH_STATE_MISMATCH'
      })
    }
    if (typeof code !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'OAUTH_INVALID_CODE'
      })
    }
    const tokenData = await $fetch(fetchTokenEndpoint, {
      dispatcher: event?.context?.proxyAgent ?? undefined,
      ...getFetchTokenOptions({
        config: providerConfig,
        code,
        redirectUri: getRedirectUri(event, providerName)
      })
    })
    return await Promise.resolve(
      handler?.(event, {
        tokenData,
        providerName,
        state: cookieState,
        callbackUrl: getCookie(event, 'oauth_callback_url')
      })
    )
  })
}
