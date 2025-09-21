# Nuxt OAuth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

一个简单易用的 Nuxt OAuth 认证模块，支持多种主流 OAuth 提供商。

## ✨ 特性

- 📦 TypeScript 支持
- 🚀 支持多种主流 OAuth 提供商
  - Feishu
  - Github
  - Discord
  - (陆续添加中...)
- 🔌 支持配置代理

## 📦 安装

```bash
# 使用 Nuxi 添加模块（推荐）
npx nuxi module add @idevless/nuxt-oauth

# 或者手动安装
npm install @idevless/nuxt-oauth
yarn add @idevless/nuxt-oauth
pnpm add @idevless/nuxt-oauth
# 然后将 @idevless/nuxt-oauth 添加到 nuxt.config.ts 文件的 modules 数组中
```

## 🎯 最佳实践

```TypeScript
// 在 server/routes/oauth/[provider].get.ts 文件中添加以下代码
export default defineEventHandler(async (event) => {
  return await sendRedirect(event, useOAuthAuthorizeURL(event))
})
```

```TypeScript
// 在 server/routes/oauth/callback/[provider].get.ts 文件中添加以下代码
export default defineEventHandler(async (event) => {
  // 传入泛型参数指定提供商，获取TS类型支持
  const tokenData = await useOAuthTokenData<'feishu'>(event)
  const userInfo = await useOAuthUserInfo<'feishu'>(event, tokenData.access_token)
  setCookie(event, 'oauth_user_info', JSON.stringify(userInfo))
  return await sendRedirect(event, '/')
})
```

> 友情提示

由于 `ofetch` 库不会自动处理代理，导致国内环境下，无法获取国外提供商的 API，可以通过下方的配置来解决该问题

```TypeScript
// 安装 undici
// npm install undici
// yarn add undici
// pnpm add undici

// 在 server/plugins/proxy.ts 文件中添加以下代码, 模块会自动使用该代理来访问API
import { ProxyAgent } from 'undici'
import { defineNitroPlugin } from '#imports'
// 代理地址需要填写本地的代理地址
const proxyAgent = new ProxyAgent('http://localhost:10808')

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', (event) => {
    event.context.proxyAgent = proxyAgent
  })
})
```

## 🔧 配置项

```TypeScript
// nuxt.config.ts
export default defineNuxtConfig({
  // 通过模块配置凭据
  oauth: {
    providers: {
      feishu: {
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
        scope: "",
      },
      // ... 更多提供商
    },
  },
  // 通过 runTimeConfig 配置凭据
  runtimeConfig: {
    oauth: {
      providers: {
        feishu: {
          clientId: 'your-client-id',
          clientSecret: 'your-client-secret',
          scope: "",
        },
        // ... 更多提供商
      }
    }
  }
})
/**
 * 通过环境变量覆盖凭据
 * NUXT_OAUTH_FEISHU_CLIENT_ID=<your-client-id>
 * NUXT_OAUTH_FEISHU_CLIENT_SECRET=<your-client-secret>
 * NUXT_OAUTH_FEISHU_SCOPE=<your-scope>
 */
```

## 写给模块协作者

如果需要添加新的提供商，请参考 `src/runtime/cores/providers` 文件夹下的文件，添加新的提供商

必须实现以下接口以及 zod schema

```TypeScript
// src/runtime/cores/providers/_base.ts
export interface IOAuthProviderDefination {
  authorizeEndpoint: string
  fetchTokenEndpoint: string
  getAuthorizeParams: (params: { config: { clientId: string; clientSecret: string; scope: string }, redirectUri: string, state: string }) => Record<string, string>
  getFetchTokenOptions: (params: { config: { clientId: string; clientSecret: string }, code: string, redirectUri: string }) => Record<string, string>
  fetchUserInfo: (params: { accessToken: string, ...options: Record<string, string> }) => Promise<Record<string, string>>
}
```

然后将提供商、schema、类型注册到 `src/runtime/cores/providers/index.ts` 文件中

## 联系我们

- 邮箱: 2831926323@qq.com
- 微信: just-a-wechat-code
