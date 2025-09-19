import { fetch } from 'ofetch'

try {
  // 配置代理（假设你的代理运行在 7890 端口）
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    proxy: 'http://127.0.0.1:7890', // 根据你的代理端口调整
    timeout: 10000 // 10秒超时
  })

  const text = await response.text()
  console.log('Response status:', response.status)
  console.log('Response text:', text)
} catch (error) {
  console.error('Error:', error.message)
}
