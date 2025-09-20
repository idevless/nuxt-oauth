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
      proxy: 'http://localhost:10808',
      providers: {
        github: {
          scopes: ['user:email']
        },
        discord: {
          scopes: ['identify', 'email']
        }
      }
    }
  }
})
