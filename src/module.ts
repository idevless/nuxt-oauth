import { defineNuxtModule, addServerImportsDir, createResolver } from '@nuxt/kit'
import { z } from 'zod'
import { moduleOptionsSchema } from './runtime/shared/schemas'
import type { PartialDeep } from 'type-fest'
import { defu } from 'defu'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    oauth?: PartialDeep<z.input<typeof moduleOptionsSchema>>
  }
}

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@idevless/nuxt-auth',
    configKey: 'oauth'
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerImportsDir(resolver.resolve('./runtime/server/composables'))
    _nuxt.options.runtimeConfig.oauth = defu(_nuxt.options.runtimeConfig.oauth, {
      credentials: {}
    })
  }
})
