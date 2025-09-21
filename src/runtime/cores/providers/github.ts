import { type IOAuthProviderDefination } from './_base'
import { z } from 'zod'

export const gitHubTokenDataSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string()
})

export const gitHubUserInfoSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().nullable(),
  url: z.string(),
  html_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  blog: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  hireable: z.boolean().nullable(),
  bio: z.string().nullable(),
  twitter_username: z.string().nullable(),
  public_repos: z.number(),
  public_gists: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
  updated_at: z.string()
})

export const githubProviderDefination: IOAuthProviderDefination = {
  authorizeEndpoint: 'https://github.com/login/oauth/authorize',
  fetchTokenEndpoint: 'https://github.com/login/oauth/access_token',
  getAuthorizeParams: ({ config: { clientId, scope }, redirectUri, state }) => ({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    state: state
  }),
  getFetchTokenOptions: ({ config: { clientId, clientSecret }, code, redirectUri }) => ({
    method: 'POST',
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }),
  fetchUserInfo: async ({ accessToken, ...options }) => {
    return await $fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      ...options
    })
  }
}
