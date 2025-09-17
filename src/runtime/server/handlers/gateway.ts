import { sendRedirect, setCookie, getRequestURL, type H3Event } from 'h3'
import { baseEventHandler } from './base'
import { providerDefinitions } from '../providers'
import { withQuery } from 'ufo'

export function defineGatewayEventHandler(props?: {
  onBeforeRedirect?: (event: H3Event, options: { providerName: string; state?: string }) => void
  onError?: (event: H3Event, error: Error) => void
}) {
  return baseEventHandler(async (event, { provider, redirectUri, enableState }) => {
    const { protocol } = getRequestURL(event)
    let state: string | undefined
    if (enableState) {
      state = crypto.randomUUID()
      setCookie(event, 'state', state, {
        httpOnly: protocol === 'https',
        secure: protocol === 'https',
        sameSite: 'lax',
        maxAge: 600
      })
    }
    await Promise.resolve(props?.onBeforeRedirect?.(event, { providerName: provider.name, state }))
    return await sendRedirect(
      event,
      withQuery(providerDefinitions[provider.name].authorizeEndpoint, {
        redirect_uri: redirectUri,
        client_id: provider.config.clientId,
        scope: provider.config.scopes.join(' '),
        state
      })
    )
  }, props?.onError)
}
