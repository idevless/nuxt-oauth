import {
  type H3Event,
  type EventHandlerResponse,
  eventHandler,
  sendRedirect,
  getRequestURL,
  getRouterParam
} from 'h3'
import { z } from 'zod'
import { useRuntimeConfig } from '#imports'
import { moduleRuntimeConfigSchema, providerConfigSchema } from '../config'
import { providerDefinitions } from '../providers'
import { withQuery } from 'ufo'

export interface BaseEventHandlerOptions {
  defaultCallbackPath: string
  enableState: boolean
  redirectUri: string
  provider: {
    name: keyof typeof providerDefinitions
    config: z.infer<typeof providerConfigSchema>
  }
}

function getRedirectUri(event: H3Event, providerName: keyof typeof providerDefinitions) {
  const { origin } = getRequestURL(event)
  return `${origin}/oauth/callback/${providerName}`
}

function getProviderName(event: H3Event) {
  const provider = getRouterParam(event, 'provider')
  if (!provider) {
    throw new Error('Provider name is required')
  }
  if (!Object.keys(providerDefinitions).includes(provider)) {
    throw new Error('Invalid provider name')
  }
  return provider as keyof typeof providerDefinitions
}

export function baseEventHandler(
  handler: (event: H3Event, options: BaseEventHandlerOptions) => EventHandlerResponse,
  onError?: (event: H3Event, error: Error) => void
) {
  return eventHandler(async (event) => {
    const { defaultCallbackPath, providers, enableState } = moduleRuntimeConfigSchema.parse(
      useRuntimeConfig(event).oauth
    )
    try {
      const providerName = getProviderName(event)
      await Promise.resolve(
        handler(event, {
          redirectUri: getRedirectUri(event, providerName),
          enableState,
          defaultCallbackPath,
          provider: { name: providerName, config: providers[providerName] }
        })
      )
    } catch (error) {
      await Promise.resolve(onError?.(event, error as Error))
      return await sendRedirect(
        event,
        withQuery(defaultCallbackPath, { error: (error as Error).message }),
        302
      )
    }
  })
}
