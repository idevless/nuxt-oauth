import { type H3Event, createError, getRouterParam, getRequestURL } from 'h3'
import { providersRegistry, type TProviderConfig, type TProviderNames } from './providers'

export type TOAuthErrorName =
  | 'PROVIDER_NOT_FOUND'
  | 'PROVIDER_CONFIG_INVALID'
  | 'CALLBACK_CODE_INVALID'
  | 'TOKEN_FETCH_ERROR'
  | 'TOKEN_PARSE_INVALID'
  | 'USER_INFO_FETCH_ERROR'
  | 'USER_INFO_PARSE_INVALID'

export function throwOAuthError(event: H3Event, name: TOAuthErrorName, data?: Record<string, any>) {
  throw createError({
    statusCode: 400,
    statusMessage: `OAUTH_${name}`,
    data: {
      providerName: getRouterParam(event, 'provider'),
      ...data
    }
  })
}

export function useOAuthProviderEventContext(event: H3Event) {
  return event.context.oauth.provider as {
    name: TProviderNames
  } & TProviderConfig
}

export function getOAuthRedirectUri(event: H3Event) {
  const { name } = useOAuthProviderEventContext(event)
  const { origin } = getRequestURL(event)
  return `${origin}/oauth/callback/${name}`
}

export function useOAuthProvider(event: H3Event) {
  return providersRegistry[useOAuthProviderEventContext(event).name].definition
}

export function useOAuthProviderTokenDataSchema(event: H3Event) {
  return providersRegistry[useOAuthProviderEventContext(event).name].tokenDataSchema
}

export function useOAuthProviderUserInfoSchema(event: H3Event) {
  return providersRegistry[useOAuthProviderEventContext(event).name].userInfoSchema
}
