import { basicEventHandler, type Promisable } from '../base'
import providers from '../providers'
import { sendRedirect, setCookie, type H3Event } from 'h3'
import { withQuery } from 'ufo'

export function defineOAuthGatewayHandler(options?: {
  onError?: (event: H3Event, error: any) => Promisable<any>
}) {
  return basicEventHandler(async (event, props) => {
    const { providerName, clientId, scopes, redirectUri, csrf, requestProtocol } = props
    let state: string | undefined
    if (['strict', 'auto'].includes(csrf)) {
      state = crypto.randomUUID()
      setCookie(event, 'oauth_state', state, {
        httpOnly: csrf === 'strict' ? true : requestProtocol === 'https',
        secure: csrf === 'strict' ? true : requestProtocol === 'https',
        sameSite: 'lax',
        maxAge: 600
      })
    }
    const provider = providers[providerName as keyof typeof providers]
    return await sendRedirect(
      event,
      withQuery(
        provider.authorizeEndpoint,
        provider.getAuthorizeQueryParams!({ clientId, scopes, redirectUri, state })
      )
    )
  }, options?.onError)
}
