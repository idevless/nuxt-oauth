import { ProxyAgent } from 'undici'
import { defineNitroPlugin } from '#imports'
const proxyAgent = new ProxyAgent('http://localhost:10808')

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', (event) => {
    event.context.proxyAgent = proxyAgent
  })
})
