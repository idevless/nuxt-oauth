import type { BaseProviderDefinition } from './_types'
import { z } from 'zod'

export const githubUserInfoSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  avatar_url: z.url(),
  email: z.email().nullable(),
  login: z.string(),
  url: z.url()
})

export const githubTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  scope: z.string()
})

export const githubProviderDefinition: BaseProviderDefinition<
  z.infer<typeof githubUserInfoSchema>,
  z.infer<typeof githubTokenSchema>
> = {
  authorizeEndpoint: 'https://github.com/login/oauth/authorize',
  tokenData: {
    request: {
      method: 'POST',
      endpoint: 'https://github.com/login/oauth/access_token',
      headers: {
        Accept: 'application/json'
      }
    },
    resolver: githubTokenSchema.parse
  },
  userInfo: {
    request: {
      endpoint: 'https://api.github.com/user',
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    },
    resolver: githubUserInfoSchema.parse
  }
}
