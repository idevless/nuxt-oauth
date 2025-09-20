# Nuxt OAuth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

一个简单易用的 Nuxt OAuth 认证模块，支持多种主流 OAuth 提供商。

## ✨ 特性

- 🛡️ 内置 CSRF 保护（基于 cookie 的状态验证）
- 📦 TypeScript 支持
- 🎯 简单的配置和使用

## 📦 安装

```bash
# 使用 Nuxi 添加模块（推荐）
npx nuxi module add @idevless/nuxt-oauth

# 或者手动安装
npm install @idevless/nuxt-oauth
# yarn add @idevless/nuxt-oauth
# pnpm add @idevless/nuxt-oauth
```

# 使用示例

```TypeScript
# 在 server/routes/oauth/[provider].get.ts 文件中添加以下代码
export default defineOAuthGatewayHandler({ providerNameFrom: 'route-param' })

```

```TypeScript
# 在 server/routes/oauth/callback/[provider].get.ts 文件中添加以下代码
export default defineOAuthCallbackHandler(async (event, { tokenData, providerName, state }) => {
  console.log(tokenData, providerName, state)
  return await sendRedirect(event, '/?status=success', 302)
})
```

```TypeScript
# 使用自定义错误页面捕获错误 app/error.vue 文件中添加以下代码
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div>
    <h2>{{ error?.statusMessage }}</h2>
    <p>{{ error?.data }}</p>
  </div>
</template>
```
