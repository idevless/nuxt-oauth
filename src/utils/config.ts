function resolveEnvironmentVariables() {
  Object.entries(process.env).forEach(([key, value]) => {
    const [_, providerName, configKey] = /^([a-zA-z0-9]+)_OAUTH_([a-zA-z0-9]+)$/.exec(key) || []
    if (providerName && configKey) {
    }
  })
}
