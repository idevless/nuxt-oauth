import { defineNuxtModule, addServerImportsDir, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    oauth?: {
      providers?: Record<
        'feishu' | 'discord' | 'github' | 'google' | string,
        {
          clientId?: string
          clientSecret?: string
          scopes?: string[]
          [key: string]: any
        }
      >
    }
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
    addServerImportsDir(resolver.resolve('./runtime/server/composables'))
    const envProviders = {} as Record<string, any>
    for (const providerName of ['discord', 'feishu', 'github', 'google']) {
      envProviders[providerName] = resolveProviderConfigFromEnvironmentVariables(providerName)
    }
    _nuxt.options.runtimeConfig.oauth = defu(
      _nuxt.options.runtimeConfig.oauth,
      {
        providers: envProviders
      },
      {
        providers: {}
      }
    )
  }
})
