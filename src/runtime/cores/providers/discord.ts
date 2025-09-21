import { type IOAuthProviderDefination } from './_base'
import { z } from 'zod'

export const discordTokenDataSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string()
})

export const discordUserInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
  global_name: z.string().nullable(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  avatar_decoration_data: z.object({}).nullable(),
  bot: z.boolean().optional(),
  system: z.boolean().optional(),
  mfa_enabled: z.boolean().optional(),
  banner: z.string().nullable(),
  accent_color: z.number().nullable(),
  locale: z.string().optional(),
  verified: z.boolean().optional(),
  email: z.string().nullable(),
  flags: z.number().optional(),
  premium_type: z.number().optional(),
  public_flags: z.number().optional(),
  clan: z.object({}).nullable()
})

export const discordProviderDefination: IOAuthProviderDefination = {
  authorizeEndpoint: 'https://discord.com/oauth2/authorize',
  fetchTokenEndpoint: 'https://discord.com/api/oauth2/token',
  getAuthorizeParams: ({ config: { clientId, scope }, redirectUri, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    state: state,
    response_type: 'code'
  }),
  getFetchTokenOptions: ({ config: { clientId, clientSecret }, code, redirectUri }) => ({
    method: 'POST',
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    }
  }),
  fetchUserInfo: async ({ accessToken, ...options }) => {
    return await $fetch(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      ...options
    })
  }
}
