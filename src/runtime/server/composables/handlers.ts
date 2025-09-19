import type { z } from 'zod'
import { withQuery } from 'ufo'
import {
  type H3Event,
  getRequestURL,
  getQuery,
  setCookie,
  getCookie,
  deleteCookie,
  createError,
  getRouterParam
} from 'h3'
import { useRuntimeConfig } from '#imports'
import { providerNames, moduleOptionsSchema, tokenDataSchema } from '../../shared/schemas'
import providerConfig from '../config'
import { defu } from 'defu'

export function useOAuthRedirectUri(
  event: H3Event,
  props?: {
    providerName?: z.infer<typeof providerNames>
    clientId?: string
    scopes?: string[]
    callbackPath?: string
  }
) {
  const { providerName, callbackPath, clientId, scopes } = defu(props, {
    providerName: getRouterParam(event, 'provider') as z.infer<typeof providerNames>,
    callbackPath: '/oauth/callback'
  })
  const { protocol, origin } = getRequestURL(event)
  const state = crypto.randomUUID()
  setCookie(event, 'oauth_state', state, {
    httpOnly: protocol === 'https',
    secure: protocol === 'https',
    sameSite: 'lax',
    maxAge: 600,
    path: '/'
  })
  const { authorizeEndpoint, extraAuthorizeParams } = providerConfig[providerName]
  const config = useRuntimeConfig(event).oauth as z.infer<typeof moduleOptionsSchema>
  return {
    authorizeUrl: withQuery(authorizeEndpoint, {
      client_id: clientId ?? config.credentials[providerName].clientId,
      redirect_uri: `${origin}${callbackPath}/${providerName}`,
      scope: scopes?.join(' ') ?? config.credentials[providerName].scopes?.join(' ') ?? '',
      state: state,
      ...extraAuthorizeParams
    }),
    state
  }
}

export async function useOAuthTokenData(
  event: H3Event,
  props?: {
    providerName?: z.infer<typeof providerNames>
    clientId?: string
    clientSecret?: string
  }
) {
  const { providerName, clientId, clientSecret } = defu(props, {
    providerName: getRouterParam(event, 'provider') as z.infer<typeof providerNames>
  })
  const { code, state } = getQuery(event)
  if (state) {
    const queryState = getCookie(event, 'oauth_state')
    deleteCookie(event, 'oauth_state')
    if (queryState !== state) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid state'
      })
    }
  }
  const { tokenEndpoint } = providerConfig[providerName]
  const { origin, pathname } = getRequestURL(event)
  const config = useRuntimeConfig(event).oauth as z.infer<typeof moduleOptionsSchema>
  const res = await $fetch(tokenEndpoint, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId ?? config.credentials[providerName].clientId,
      client_secret: clientSecret ?? config.credentials[providerName].clientSecret,
      code: code,
      redirect_uri: `${origin}${pathname}`,
      grant_type: 'authorization_code'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return tokenDataSchema.parse(res)
}
