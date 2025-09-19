import { defineNuxtModule, addServerImportsDir, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import { z } from 'zod'
import type {
  TProviderBasicConfigInput,
  TSupportedProviderNames,
  TOAuthConfigInput
} from './runtime/base'

export interface ModuleOptions {}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    oauth?: {
      providers?: Record<TSupportedProviderNames | string, TProviderBasicConfigInput>
    } & TOAuthConfigInput
  }
}

function resolveProviderConfigFromEnvironmentVariables(providerName: string) {
  return {
    clientId: process.env[`OAUTH_${providerName.toUpperCase()}_CLIENT_ID`],
    clientSecret: process.env[`OAUTH_${providerName.toUpperCase()}_CLIENT_SECRET`],
    scopes: process.env[`OAUTH_${providerName.toUpperCase()}_SCOPES`]?.split(',') || []
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@idevless/nuxt-auth',
    configKey: 'oauth'
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerImportsDir(resolver.resolve('./runtime/handlers'))
    const envProviders = {} as Record<string, any>
    for (const providerName of ['discord', 'feishu', 'github', 'google']) {
      envProviders[providerName] = resolveProviderConfigFromEnvironmentVariables(providerName)
    }
    _nuxt.options.runtimeConfig.oauth = defu(
      _nuxt.options.runtimeConfig.oauth ?? {
        providers: {}
      },
      {
        providers: envProviders
      },
      {
        callbackPath: '/',
        proxy: undefined,
        csrf: 'auto'
      } as TOAuthConfigInput
    )
  }
})
