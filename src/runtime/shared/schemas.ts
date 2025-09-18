import { z } from 'zod'

export const providerCredentialsSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  scopes: z.array(z.string()).default([])
})

export const tokenDataSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string().default('bearer'),
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional(),
  id_token: z.string().optional()
})

export const providerNames = z.enum(['github', 'feishu', 'discord'])

export const moduleOptionsSchema = z.object({
  credentials: z.record(providerNames, providerCredentialsSchema)
})
