import requests

response = requests.post(
        'https://discord.com/api/oauth2/token',
        timeout=10  # 10秒超时
    )

print(response.text)

