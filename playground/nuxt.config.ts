export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2025-09-15',
  devtools: { enabled: true },
  runtimeConfig: {
    oauth: {
      providers: {
        github: {
          clientId: '',
          clientSecret: '',
          scopes: []
        }
      }
    }
  }
})
