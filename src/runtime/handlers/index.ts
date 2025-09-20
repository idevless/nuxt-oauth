import {
  type H3Event,
  createError,
  eventHandler,
  getCookie,
  getQuery,
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
    const providerName = getProviderName(event, props?.providerNameFrom ?? 'query')
    const {
      providerConfig,
      oauthConfig: { stateSecure }
    } = parseRuntimeConfig(event, providerName)
    const { authorizeConstructor } = providers[providerName]
    if (!authorizeConstructor) {
      throw createError({
        statusCode: 500,
        statusMessage: `OAUTH_PROVIDER_AUTHORIZE_CONSTRUCTOR_FUNCTION_NOT_DEFINED`,
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
    const { endpoint, params } = authorizeConstructor({
      config: providerConfig,
      redirectUri: getRedirectUri(event, providerName),
      state
    })
    return await sendRedirect(event, withQuery(endpoint, params))
  })
}

export function defineOAuthCallbackHandler(
  handler?: (
    event: H3Event,
    props: { tokenData: any; providerName: string; state?: string }
  ) => Promisable<void>,
  options?: {
    extraFetchOptions?: {
      dispatcher?: any
      [key: string]: any
    }
  }
) {
  return eventHandler(async (event) => {
    const providerName = getProviderName(event, 'route-param')
    const {
      providerConfig,
      oauthConfig: { csrf }
    } = parseRuntimeConfig(event, providerName)
    const { getToken } = providers[providerName]
    if (!getToken) {
      throw createError({
        statusCode: 500,
        statusMessage: `OAUTH_PROVIDER_GET_TOKEN_FUNCTION_NOT_DEFINED`,
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
    const tokenData = await getToken(
      {
        config: providerConfig,
        code,
        redirectUri: getRedirectUri(event, providerName)
      },
      options?.extraFetchOptions
    )
    await Promise.resolve(handler?.(event, { tokenData, providerName, state: cookieState }))
  })
}
