import { ofetch } from 'ofetch'
import { ProxyAgent } from 'undici'

// Replace <proxy_url> with your actual proxy URL
const agent = new ProxyAgent('http://127.0.0.1:10808')

// Use fetch with the agent option to make an HTTP request through the proxy
// Replace <target_url> with the URL you want to request
ofetch('https://discord.com/api/oauth2/token', { dispatcher: agent, method: 'POST' })
  .then((response) => response.text())
  .then((text) => console.log(text))
  .catch((error) => console.error(error))
