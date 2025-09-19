export default defineOAuthCallbackHandler({
  onSuccess: async (event, { tokenData, providerName, state }) => {
    return await sendRedirect(event, '/?status=success')
  }
})
