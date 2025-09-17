import { z } from 'zod'
import { providerDefinitions } from './server/providers'

export const providerConfigSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  scopes: z.array(z.string()).default([])
})

export const providerNameEnumsSchema = z.enum(
  Object.keys(providerDefinitions) as Array<keyof typeof providerDefinitions>
)

export const providerConfigRecordSchema = z.record(providerNameEnumsSchema, providerConfigSchema)

export const moduleRuntimeConfigSchema = z.object({
  providers: providerConfigRecordSchema,
  defaultCallbackPath: z.string().default('/'),
  enableState: z.boolean().default(false)
})
