interface RequestConstructor {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT'
  headers?: Record<string, string>
  timeout?: number
  extraParams?: Record<string, string>
}

export interface BaseProviderDefinition<UserInfo, TokenData> {
  authorizeEndpoint: string
  tokenData: {
    request: RequestConstructor
    resolver: (data: any) => TokenData
  }
  userInfo: {
    request: RequestConstructor
    resolver: (data: any) => UserInfo
  }
}
