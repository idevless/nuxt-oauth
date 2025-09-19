import { $fetch } from 'ofetch'
import { ProxyAgent } from 'undici'

const proxyAgent = new ProxyAgent('http://127.0.0.1:10808')

const fetchClient = $fetch.create({ dispatcher: proxyAgent })

fetchClient('https://discord.com/api/oauth2/token', {
  method: 'POST',
  body: new URLSearchParams({
    client_id: '1234567890',
    client_secret: '1234567890',
    code: '1234567890',
    redirect_uri: 'https://example.com',
    grant_type: 'authorization_code'
  }),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  onResponseError: ({ response }) => {
    console.error(response.text)
  }
})
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
