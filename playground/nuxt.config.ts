export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2025-09-15',
  devtools: { enabled: true },
  runtimeConfig: {
    oauth: {
      credentials: {
        github: {
          clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
          clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
          scopes: ['user:email']
        },
        feishu: {
          clientId: process.env.FEISHU_OAUTH_CLIENT_ID,
          clientSecret: process.env.FEISHU_OAUTH_CLIENT_SECRET
        }
      }
    }
  }
})
