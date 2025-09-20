export default defineOAuthCallbackHandler(
  async (event, { tokenData, providerName, state, callbackUrl }) => {
    console.log(tokenData)
    return await sendRedirect(event, callbackUrl ?? '/')
  }
)
