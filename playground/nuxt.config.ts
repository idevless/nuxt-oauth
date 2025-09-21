export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui'],
  compatibilityDate: '2025-09-15',
  css: ['~/assets/css/main.css'],
  $development: {
    devtools: { enabled: true },
    ui: {
      fonts: false
    },
    oauth: {
      discord: { scope: 'identify email' }
    }
  }
})
