import { type H3Event } from 'h3'
import { useOAuthProviderEventContext, useOAuthProvider, getOAuthRedirectUri } from '../cores'
import { withQuery } from 'ufo'

export function useOAuthAuthorizeURL(
  event: H3Event,
  extraParams?: {
    state?: string
    [key: string]: string | undefined
  }
) {
  const { clientSecret: _, ...config } = useOAuthProviderEventContext(event)
  const { authorizeEndpoint, getAuthorizeParams } = useOAuthProvider(event)
  const queryParams = getAuthorizeParams({
    config,
    redirectUri: getOAuthRedirectUri(event),
    ...extraParams
  })
  return withQuery(authorizeEndpoint, queryParams)
}
