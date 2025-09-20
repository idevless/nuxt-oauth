import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  // 当有警告时不让构建失败
  failOnWarn: false,

  // 外部依赖配置，避免将某些依赖打包进最终产物
  externals: ['@nuxt/kit', '@nuxt/schema', 'nuxt', 'undici'],

  // 声明配置
  declaration: true,

  // 清理输出目录
  clean: true
})
