import { ProxyAgent } from 'undici'

const proxyAgent = new ProxyAgent('http://localhost:10808')

export default defineOAuthCallbackHandler(
  async (event, { tokenData, providerName, state }) => {
    console.log(tokenData, providerName, state)
    return await sendRedirect(event, '/?status=success', 302)
  },
  { extraFetchOptions: { dispatcher: proxyAgent } }
)
