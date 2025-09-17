import type { BaseProviderDefinition } from './_types'
import { z } from 'zod'

export const googleUserInfoSchema = z.object({
  name: z
    .object({
      givenName: z.string(),
      familyName: z.string(),
      displayName: z.string(),
      displayNameLastFirst: z.string(),
      middleName: z.string()
    })
    .optional(),
  emailAddresses: z
    .object({
      value: z.string(),
      type: z.enum(['HOME', 'WORK', 'OTHER']),
      displayName: z.string()
    })
    .optional(),
  photos: z
    .object({
      url: z.url(),
      default: z.boolean()
    })
    .optional(),
  nickname: z.object({
    value: z.string(),
    type: z.enum(['DEFAULT', 'INITIALS', 'GPLUS', 'OTHER_NAME', 'ALTERNATE_NAME', 'SHORT_NAME'])
  })
})

export const googleTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  expires_in: z.number(),
  scope: z.string(),
  refresh_token_expires_in: z.number()
})

export const googleProviderDefinition: BaseProviderDefinition<
  z.infer<typeof googleUserInfoSchema>,
  z.infer<typeof googleTokenSchema>
> = {
  authorizeEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenData: {
    request: {
      endpoint: 'https://oauth2.googleapis.com/token',
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      extraParams: {
        grant_type: 'authorization_code'
      }
    },
    resolver: googleTokenSchema.parse
  },
  userInfo: {
    request: {
      endpoint: 'https://people.googleapis.com/v1/people/me',
      method: 'GET',
      headers: {}
    },
    resolver: googleUserInfoSchema.parse
  }
}
