import { defineNuxtModule, addServerImports, createResolver } from '@nuxt/kit'
import { moduleRuntimeConfigSchema } from './runtime/config'
import type { z } from 'zod'
import type { PartialDeep } from 'type-fest'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    oauth?: PartialDeep<z.input<typeof moduleRuntimeConfigSchema>>
  }
}

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@idevless/nuxt-oauth',
    configKey: 'oauth'
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerImports([
      {
        from: resolver.resolve('runtime'),
        name: 'defineCallbackEventHandler'
      },
      {
        from: resolver.resolve('runtime'),
        name: 'defineGatewayEventHandler'
      }
    ])
  }
})
