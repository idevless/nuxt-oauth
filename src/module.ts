import { defineNuxtModule, addServerImportsDir, addServerHandler, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import { type TProviderNames, type TProviderConfig, providersRegistry } from './runtime/cores'

export interface ModuleOptions extends Record<TProviderNames, Partial<TProviderConfig>> {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@idevless/nuxt-auth',
    configKey: 'oauth'
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerImportsDir(resolver.resolve('./runtime/composables'))
    addServerHandler({
      middleware: true,
      handler: resolver.resolve('./runtime/middleware/oauth')
    })
    _nuxt.hook('nitro:config', (config) => {
      config.runtimeConfig = defu({ oauth: _options }, config.runtimeConfig, {
        oauth: Object.keys(providersRegistry).reduce((acc, provider) => {
          acc[provider] = {
            clientId: '',
            clientSecret: '',
            scope: ''
          }
          return acc
        }, {} as any)
      })
    })
  }
})
