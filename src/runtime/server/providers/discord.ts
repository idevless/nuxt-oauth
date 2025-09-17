import type { BaseProviderDefinition } from './_types'
import { z } from 'zod'

export const discordUserInfoSchema = z.object({
  id: z.string(),
  global_name: z.string().optional(),
  username: z.string(),
  avatar: z.string().optional(),
  email: z.email().optional()
})

export const discordTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string()
})

export const discordProviderDefinition: BaseProviderDefinition<
  z.infer<typeof discordUserInfoSchema>,
  z.infer<typeof discordTokenSchema>
> = {
  authorizeEndpoint: 'https://discord.com/oauth2/authorize',
  tokenData: {
    request: {
      method: 'POST',
      endpoint: 'https://discord.com/api/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      extraParams: {
        grant_type: 'authorization_code'
      }
    },
    resolver: discordTokenSchema.parse
  },
  userInfo: {
    request: {
      endpoint: 'https://discord.com/api/users/@me',
      method: 'GET'
    },
    resolver: (res) => discordUserInfoSchema.parse(res.data)
  }
}
