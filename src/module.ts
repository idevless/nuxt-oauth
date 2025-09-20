import { defineNuxtModule, addServerImportsDir, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import type { TOAuthConfigInput, TProviderConfigInput } from './runtime/cores'

export interface ModuleOptions {}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    oauth?: {
      providers?: Record<string, TProviderConfigInput>
    } & TOAuthConfigInput
  }
}

function resolveProviderConfigFromEnvironmentVariables(providerName: string) {
  return {
    clientId: process.env[`OAUTH_${providerName.toUpperCase()}_CLIENT_ID`] ?? undefined,
    clientSecret: process.env[`OAUTH_${providerName.toUpperCase()}_CLIENT_SECRET`] ?? undefined,
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
        csrf: 'auto'
      } as TOAuthConfigInput
    )
  }
})
