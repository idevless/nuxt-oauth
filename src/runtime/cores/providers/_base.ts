import type { NitroFetchOptions } from 'nitropack'
import { z } from 'zod'

export const providerConfigSchema = z.object({
  clientId: z.string().min(4, 'Client ID is required'),
  clientSecret: z.string().min(4, 'Client Secret is required'),
  scope: z.string().default('')
})

export type TProviderConfig = z.infer<typeof providerConfigSchema>

export type TProviderConfigInput = z.input<typeof providerConfigSchema>

export interface IOAuthProviderDefination {
  authorizeEndpoint: string
  getAuthorizeParams: (props: {
    config: Omit<TProviderConfig, 'clientSecret'>
    redirectUri: string
    state?: string
  }) => Record<string, string | undefined>
  fetchTokenEndpoint: string
  getFetchTokenOptions: (props: {
    config: TProviderConfig
    code: string
    redirectUri: string
  }) => NitroFetchOptions<'POST'>
  fetchUserInfo: (
    props: {
      accessToken?: string
    } & NitroFetchOptions<'GET'>
  ) => Promise<any>
}
