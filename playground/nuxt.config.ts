export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui'],
  compatibilityDate: '2025-09-15',
  devtools: { enabled: true },
  ui: {
    fonts: false
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    oauth: {
      providers: {
        github: {
          clientId: '1234567890',
          clientSecret: '1234567890',
          scopes: ['user:email']
        },
        discord: {
          clientId: '1234567890',
          clientSecret: '1234567890',
          scopes: ['identify', 'email']
        }
      }
    }
  }
})
