import { type H3Event, setCookie } from 'h3'
import { useOAuthProviderEventContext, useOAuthProvider, getOAuthRedirectUri } from '../cores'
import { withQuery } from 'ufo'
import { randomUUID } from 'node:crypto'

export function useOAuthAuthorizeURL(
  event: H3Event,
  extraParams?: {
    state?: string
    [key: string]: string | undefined
  }
) {
  const { clientSecret: _, ...config } = useOAuthProviderEventContext(event)
  const { authorizeEndpoint, getAuthorizeParams } = useOAuthProvider(event)
  let _extraParams = {}
  let state: string
  if (extraParams?.state) {
    state = extraParams.state
    const { state: _, ...rest } = extraParams
    _extraParams = rest
  } else {
    state = randomUUID()
  }
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: !import.meta.dev,
    maxAge: 600,
    sameSite: 'lax'
  })
  const redirectUri = getOAuthRedirectUri(event)
  const queryParams = getAuthorizeParams({
    config,
    redirectUri,
    state,
    ..._extraParams
  })
  return withQuery(authorizeEndpoint, queryParams)
}
