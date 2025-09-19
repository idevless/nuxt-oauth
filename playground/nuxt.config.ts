export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2025-09-15',
  devtools: { enabled: true },
  runtimeConfig: {
    oauth: {
      proxy: 'http://localhost:10808',
      providers: {
        github: {
          enabledProxy: true
        },
        discord: {
          enabledProxy: true,
          scopes: ['identify', 'email']
        }
      }
    }
  }
})
