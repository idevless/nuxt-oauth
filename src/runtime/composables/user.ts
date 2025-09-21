import { type H3Event } from 'h3'
import {
  type TProviderNames,
  useOAuthProviderUserInfoSchema,
  useOAuthProvider,
  throwOAuthError,
  providersRegistry
} from '../cores'
import { z } from 'zod'

export async function useOAuthUserInfo<T extends TProviderNames>(
  event: H3Event,
  accessToken: string
) {
  const { fetchUserInfo } = useOAuthProvider(event)
  const res = await fetchUserInfo({
    dispatcher: event?.context?.proxyAgent,
    accessToken,
    onResponseError: ({ response: { _data } }) => {
      throwOAuthError(event, 'USER_INFO_FETCH_ERROR', { res: _data })
    }
  })
  const { data, success } = useOAuthProviderUserInfoSchema(event).safeParse(res)
  if (!success) {
    throwOAuthError(event, 'USER_INFO_PARSE_INVALID', { res })
  }
  return data as z.infer<(typeof providersRegistry)[T]['userInfoSchema']>
}
