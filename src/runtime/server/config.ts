import { providerNames } from '../shared/schemas'
import type { z } from 'zod'

export default {
  github: {
    authorizeEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token'
  },
  feishu: {
    authorizeEndpoint: 'https://open.feishu.cn/open-apis/authen/v1/authorize',
    tokenEndpoint: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token'
  },
  discord: {
    authorizeEndpoint: 'https://discord.com/api/oauth2/authorize',
    extraAuthorizeParams: {
      response_type: 'code'
    },
    tokenEndpoint: 'https://discord.com/api/oauth2/token'
  }
} as Record<
  z.infer<typeof providerNames>,
  {
    authorizeEndpoint: string
    tokenEndpoint: string
    extraAuthorizeParams?: Record<string, string>
  }
>
