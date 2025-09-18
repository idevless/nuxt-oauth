export default defineEventHandler(async (event) => {
  const { authorizeUrl } = useOAuthRedirectUri(event)
  return await sendRedirect(event, authorizeUrl)
})
