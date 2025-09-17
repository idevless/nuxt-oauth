import { sendRedirect, getCookie, deleteCookie, getQuery, type H3Event } from 'h3'
import { baseEventHandler } from './base'
import { providerDefinitions } from '../providers'
import { withQuery } from 'ufo'

type GetProviderUserInfo<T extends keyof typeof providerDefinitions> =
  T extends keyof typeof providerDefinitions
    ? (typeof providerDefinitions)[T]['userInfo']['resolver'] extends (data: any) => any
      ? ReturnType<(typeof providerDefinitions)[T]['userInfo']['resolver']>
      : never
    : never
type GetProviderTokenData<T extends keyof typeof providerDefinitions> =
  T extends keyof typeof providerDefinitions
    ? (typeof providerDefinitions)[T]['tokenData']['resolver'] extends (data: any) => any
      ? ReturnType<(typeof providerDefinitions)[T]['tokenData']['resolver']>
      : never
    : never
export function defineCallbackEventHandler(props?: {
  onSuccess?: <T extends keyof typeof providerDefinitions>(
    event: H3Event,
    options: {
      providerName: T
      tokenData: GetProviderTokenData<T>
      userInfo: GetProviderUserInfo<T>
      state?: string
    }
  ) => void
  onError?: (event: H3Event, error: Error) => void
}) {
  return baseEventHandler(
    async (event, { provider, redirectUri, enableState, defaultCallbackPath }) => {
      const { code, state: queryState } = getQuery(event)
      if (enableState) {
        const state = getCookie(event, 'state')
        deleteCookie(event, 'state')
        if (!state) {
          throw new Error('State is required')
        }
        if (state !== queryState) {
          throw new Error('State is not valid')
        }
      }
      const providerDefinition = providerDefinitions[provider.name]
      const tokenResponse = await $fetch(providerDefinition.tokenData.request.endpoint, {
        method: providerDefinition.tokenData.request.method,
        headers: providerDefinition.tokenData.request.headers,
        body: JSON.stringify({
          code,
          client_id: provider.config.clientId,
          client_secret: provider.config.clientSecret,
          redirect_uri: redirectUri,
          ...providerDefinition.tokenData.request.extraParams
        })
      })
      let tokenData: GetProviderTokenData<typeof provider.name>
      let userInfo: GetProviderUserInfo<typeof provider.name>
      try {
        tokenData = providerDefinition.tokenData.resolver(tokenResponse)
      } catch (error) {
        throw new Error('Invalid token response')
      }
      try {
        userInfo = providerDefinition.userInfo.resolver(
          await $fetch(providerDefinition.userInfo.request.endpoint, {
            method: providerDefinition.userInfo.request.method,
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              ...providerDefinition.userInfo.request.headers
            },
            params: providerDefinition.userInfo.request.extraParams
          })
        )
      } catch (error) {
        throw new Error('Invalid user info response')
      }
      await Promise.resolve(
        props?.onSuccess?.(event, {
          providerName: provider.name,
          tokenData,
          userInfo,
          state: queryState as string
        })
      )
      return await sendRedirect(event, defaultCallbackPath)
    },
    props?.onError
  )
}
