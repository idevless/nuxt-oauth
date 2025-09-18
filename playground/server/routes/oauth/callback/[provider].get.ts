export default defineEventHandler(async (event) => {
  const tokenData = await useOAuthTokenData(event)
  console.log(tokenData)
  return await sendRedirect(event, '/?status=success')
})
