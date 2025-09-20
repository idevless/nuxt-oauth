import { z } from 'zod'
import { oauthConfigSchema, providerConfigSchema, providerBasicTokenSchema } from './schemas'
import type { NitroFetchOptions } from 'nitropack'
export type Promisable<T> = T | Promise<T>

export type TOAuthConfig = z.infer<typeof oauthConfigSchema>
export type TOAuthConfigInput = Partial<z.input<typeof oauthConfigSchema>>

export type TProviderConfig = Required<z.infer<typeof providerConfigSchema>>
export type TProviderConfigInput = Partial<z.input<typeof providerConfigSchema>>

export type TProviderBasicToken = z.infer<typeof providerBasicTokenSchema>
export type TProviderBasicTokenInput = Partial<z.input<typeof providerBasicTokenSchema>>

export interface IOAuthProvider<TToken = TProviderBasicToken> {
  authorizeEndpoint?: string
  getAuthorizeParams?: (props: {
    config: Omit<TProviderConfig, 'clientSecret'>
    redirectUri: string
    state?: string
  }) => Record<string, string | undefined>
  fetchTokenEndpoint?: string
  getFetchTokenOptions?: (props: {
    config: TProviderConfig
    code: string
    redirectUri: string
  }) => NitroFetchOptions<'POST'>
}
