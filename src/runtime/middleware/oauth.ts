import { defineEventHandler, getRequestURL } from 'h3'
import { useRuntimeConfig } from '#imports'
import {
  throwOAuthError,
  providerConfigSchema,
  type TProviderConfig,
  type TProviderNames
} from '../cores'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/oauth/')) {
    const { pathname } = getRequestURL(event)
    const providerName = (pathname.split('/').pop() ??
      throwOAuthError(event, 'PROVIDER_NOT_FOUND')) as TProviderNames
    const providerConfigRecord = (useRuntimeConfig(event)?.oauth ?? {}) as Record<
      TProviderNames,
      TProviderConfig
    >
    if (!providerConfigRecord || !Object.keys(providerConfigRecord).includes(providerName)) {
      throwOAuthError(event, 'PROVIDER_CONFIG_INVALID')
    }
    const parsedConfigResult = providerConfigSchema.safeParse(providerConfigRecord[providerName])
    if (!parsedConfigResult.success) {
      throwOAuthError(event, 'PROVIDER_CONFIG_INVALID')
    }
    Object.assign(event.context, {
      oauth: {
        provider: {
          name: providerName,
          ...parsedConfigResult.data
        }
      }
    })
  }
})
