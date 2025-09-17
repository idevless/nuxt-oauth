export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2025-09-15',
  devtools: { enabled: true },
  runtimeConfig: {
    oauth: {
      enableState: true,
      providers: {}
    }
  }
})
