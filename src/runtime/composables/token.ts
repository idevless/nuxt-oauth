import { type H3Event, getQuery, getCookie } from 'h3'
import {
  type TProviderNames,
  useOAuthProviderTokenDataSchema,
  getOAuthRedirectUri,
  useOAuthProvider,
  useOAuthProviderEventContext,
  throwOAuthError,
  providersRegistry
} from '../cores'
import { z } from 'zod'

export async function useOAuthTokenData<T extends TProviderNames>(event: H3Event) {
  const { fetchTokenEndpoint, getFetchTokenOptions } = useOAuthProvider(event)
  const { code, state } = getQuery(event)
  if (!code) {
    throwOAuthError(event, 'CALLBACK_CODE_INVALID')
  }
  if (!state) {
    throwOAuthError(event, 'CALLBACK_STATE_MISSING')
  }
  if (state !== getCookie(event, 'oauth_state')) {
    throwOAuthError(event, 'CALLBACK_STATE_MISMATCH')
  }
  const { name: _, ...config } = useOAuthProviderEventContext(event)
  const res = await $fetch(fetchTokenEndpoint, {
    dispatcher: event?.context?.proxyAgent,
    ...getFetchTokenOptions({
      code: code as string,
      redirectUri: getOAuthRedirectUri(event),
      config
    }),
    onResponseError: ({ response: { _data } }) => {
      throwOAuthError(event, 'TOKEN_FETCH_ERROR', { res: _data })
    }
  })
  const { data, success } = useOAuthProviderTokenDataSchema(event).safeParse(res)
  if (!success) {
    throwOAuthError(event, 'TOKEN_PARSE_INVALID', { res })
  }
  return data as z.infer<(typeof providersRegistry)[T]['tokenDataSchema']>
}
