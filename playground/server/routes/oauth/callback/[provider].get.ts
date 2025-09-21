export default defineEventHandler(async (event) => {
  const tokenData = await useOAuthTokenData<'feishu'>(event)
  const userInfo = await useOAuthUserInfo<'feishu'>(event, tokenData.access_token)
  setCookie(event, 'oauth_user_info', JSON.stringify(userInfo))
  return await sendRedirect(event, '/')
})
