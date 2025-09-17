export default defineCallbackEventHandler({
  onSuccess: (event, { providerName, tokenData, userInfo }) => {
    console.log(providerName, tokenData, userInfo)
  }
})
