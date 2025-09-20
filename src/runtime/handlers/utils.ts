import { type H3Event, getQuery, getRouterParam, createError, getRequestURL } from 'h3'
import providers from '../providers'
import {
  oauthConfigSchema,
  providerConfigSchema,
  type TProviderConfig,
  type TOAuthConfig
} from '../cores'
import { useRuntimeConfig } from '#imports'

export function getRedirectUri(event: H3Event, providerName: string) {
  const { origin } = getRequestURL(event)
  return `${origin}/oauth/callback/${providerName}`
}

export function getProviderName(event: H3Event, providerNameFrom?: 'query' | 'route-param') {
  let providerName: any
  if (providerNameFrom === 'query') {
    providerName = getQuery(event).provider
  } else {
    providerName = getRouterParam(event, 'provider')
  }
  if (typeof providerName !== 'string' || !Object.keys(providers).includes(providerName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OAUTH_INVALID_PROVIDER_NAME'
    })
  }
  return providerName as keyof typeof providers
}

export function parseRuntimeConfig(
  event: H3Event,
  providerName: string
): {
  providerConfig: TProviderConfig
  oauthConfig: TOAuthConfig & { stateSecure: boolean }
} {
  const { protocol } = getRequestURL(event)
  const { providers, ...moduleConfig } = useRuntimeConfig(event)!.oauth!
  const providerConfigParsed = providerConfigSchema.safeParse(providers?.[providerName])
  if (!providerConfigParsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OAUTH_INVALID_PROVIDER_CONFIG',
      data: providerConfigParsed.error.message
    })
  }
  const oauthConfigParsed = oauthConfigSchema.safeParse(moduleConfig)
  if (!oauthConfigParsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OAUTH_INVALID_MODULE_CONFIG',
      data: oauthConfigParsed.error.message
    })
  }
  const { csrf, ...oauthConfig } = oauthConfigParsed.data
  const stateSecure = csrf === 'strict' || (csrf === 'auto' && protocol === 'https')
  return {
    providerConfig: providerConfigParsed.data,
    oauthConfig: { ...oauthConfig, stateSecure, csrf }
  }
}
