export * from './_base'

import { githubProviderDefination, gitHubTokenDataSchema, gitHubUserInfoSchema } from './github'
import { discordProviderDefination, discordTokenDataSchema, discordUserInfoSchema } from './discord'
import {
  feishuProvider as feishuProviderDefination,
  feishuTokenDataSchema,
  feishuUserInfoSchema
} from './feishu'

export const providersRegistry = {
  github: {
    definition: githubProviderDefination,
    userInfoSchema: gitHubUserInfoSchema,
    tokenDataSchema: gitHubTokenDataSchema
  },
  feishu: {
    definition: feishuProviderDefination,
    userInfoSchema: feishuUserInfoSchema,
    tokenDataSchema: feishuTokenDataSchema
  },
  discord: {
    definition: discordProviderDefination,
    userInfoSchema: discordUserInfoSchema,
    tokenDataSchema: discordTokenDataSchema
  }
}

export type TProviderNames = keyof typeof providersRegistry
