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
npx nuxi module add @idevless/nuxt-oauth
```

## 🚀 快速开始

### 1. 添加模块到 Nuxt 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-oauth'],
  runtimeConfig: {
    oauth: {
      enableState: true, // 启用 CSRF 保护
      defaultCallbackPath: '/', // 认证成功后的默认跳转路径
      providers: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scopes: ['user:email'] // 可选，默认为空数组
        },
        feishu: {
          clientId: process.env.FEISHU_CLIENT_ID,
          clientSecret: process.env.FEISHU_CLIENT_SECRET,
          scopes: [] // 可选
        }
      }
    }
  }
})
```

### 2. 创建 OAuth 路由处理器

#### 授权入口路由

创建 `server/routes/oauth/[provider].get.ts`：

```typescript
export default defineGatewayEventHandler({
  // 可选：重定向前的回调
  onBeforeRedirect: (event, { providerName, state }) => {
    console.log(`准备跳转到 ${providerName} 进行授权`)
  },
  // 可选：错误处理
  onError: (event, error) => {
    console.error('OAuth 授权错误:', error)
  }
})
```

#### 回调路由

创建 `server/routes/oauth/callback/[provider].get.ts`：

```typescript
export default defineCallbackEventHandler({
  // 认证成功回调
  onSuccess: (event, { providerName, tokenData, userInfo, state }) => {
    console.log('认证成功:', {
      provider: providerName,
      user: userInfo,
      token: tokenData
    })

    // 在这里可以：
    // 1. 将用户信息保存到数据库
    // 2. 创建会话
    // 3. 设置 JWT token
    // 4. 其他业务逻辑
  },
  // 可选：错误处理
  onError: (event, error) => {
    console.error('OAuth 回调错误:', error)
    // 重定向到错误页面
    return sendRedirect(event, '/?error=' + encodeURIComponent(error.message))
  }
})
```

### 3. 在前端创建登录链接

```vue
<template>
  <div>
    <h1>登录</h1>
    <a href="/oauth/github" class="btn">使用 GitHub 登录</a>
    <a href="/oauth/feishu" class="btn">使用飞书登录</a>
  </div>
</template>
```

## 🔧 配置选项

### 运行时配置

```typescript
interface RuntimeConfig {
  oauth: {
    enableState?: boolean // 是否启用 CSRF 保护，默认 false
    defaultCallbackPath?: string // 认证成功后的默认跳转路径，默认 '/'
    providers: {
      [providerName: string]: {
        clientId: string
        clientSecret: string
        scopes?: string[] // OAuth 作用域，默认为空数组
      }
    }
  }
}
```

### 环境变量

推荐使用环境变量来配置敏感信息：

```bash
# .env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FEISHU_CLIENT_ID=your_feishu_client_id
FEISHU_CLIENT_SECRET=your_feishu_client_secret
```

## 📚 支持的提供商

### GitHub

```typescript
// 用户信息类型
interface GitHubUser {
  id: number
  name: string | null
  avatar_url: string
  email: string | null
  login: string
  url: string
}

// Token 信息类型
interface GitHubToken {
  access_token: string
  token_type: string
  scope: string
}
```

**配置 GitHub OAuth 应用：**

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth 应用
3. 设置回调 URL：`http://localhost:3000/oauth/callback/github`

### 飞书 (Feishu)

```typescript
// 用户信息类型
interface FeishuUser {
  user_id: string
  open_id: string
  union_id: string
  name?: string
  en_name?: string
  avatar_url: string
  email?: string
  mobile?: string
  tenent_key?: string
  enterprise_email?: string
  employee_no?: string
}

// Token 信息类型
interface FeishuToken {
  access_token: string
  expires_in: number
  refresh_token?: string
  refresh_token_expires_in?: number
  scope: string
}
```

**配置飞书 OAuth 应用：**

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 配置重定向 URL：`http://localhost:3000/oauth/callback/feishu`

## 🔒 安全性

### CSRF 保护

启用 `enableState: true` 来开启 CSRF 保护：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    oauth: {
      enableState: true // 启用状态验证
      // ...
    }
  }
})
```

当启用状态验证时，模块会：

1. 在授权请求中生成随机 state 参数
2. 将 state 存储在 HTTP-only cookie 中
3. 在回调中验证 state 参数是否匹配

### Cookie 安全

State cookie 的安全配置：

- `httpOnly`: 在 HTTPS 环境下自动启用
- `secure`: 在 HTTPS 环境下自动启用
- `sameSite`: 设置为 'lax'
- `maxAge`: 10 分钟过期

## 🛠️ 高级用法

### 自定义错误处理

```typescript
export default defineCallbackEventHandler({
  onError: async (event, error) => {
    // 记录错误日志
    console.error('OAuth 认证失败:', error)

    // 重定向到自定义错误页面
    return sendRedirect(event, `/auth/error?message=${encodeURIComponent(error.message)}`)
  }
})
```

### 会话管理集成

```typescript
export default defineCallbackEventHandler({
  onSuccess: async (event, { userInfo, tokenData }) => {
    // 创建用户会话
    const session = await createUserSession({
      userId: userInfo.id,
      email: userInfo.email,
      accessToken: tokenData.access_token
    })

    // 设置会话 cookie
    setCookie(event, 'session', session.id, {
      httpOnly: true,
      secure: true,
      maxAge: 86400 // 24 小时
    })
  }
})
```

### 数据库集成

```typescript
export default defineCallbackEventHandler({
  onSuccess: async (event, { providerName, userInfo, tokenData }) => {
    // 查找或创建用户
    let user = await findUserByEmail(userInfo.email)

    if (!user) {
      user = await createUser({
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.avatar_url,
        provider: providerName
      })
    }

    // 更新或创建 OAuth 连接
    await upsertOAuthConnection({
      userId: user.id,
      provider: providerName,
      providerId: userInfo.id.toString(),
      accessToken: tokenData.access_token
    })
  }
})
```

## 🧪 开发和测试

### 运行示例项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看示例应用。

### 测试

```bash
# 运行测试
npm run test

# 监听模式
npm run test:watch
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](./LICENSE)

## 🔗 相关链接

- [Nuxt 3 文档](https://nuxt.com/)
- [H3 文档](https://github.com/unjs/h3)
- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [飞书 OAuth 文档](https://open.feishu.cn/document/ukTMukTMukTM/ukzN4UjL5cDO14SO3gTN)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-oauth/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-oauth
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-oauth.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-oauth
[license-src]: https://img.shields.io/npm/l/nuxt-oauth.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-oauth
