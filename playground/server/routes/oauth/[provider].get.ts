export default defineEventHandler(async (event) => {
  return await sendRedirect(event, useOAuthAuthorizeURL(event))
})
