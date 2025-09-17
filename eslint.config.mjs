// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true
  },
  dirs: {
    src: ['./playground']
  }
}).append([
  {
    rules: {
      // 禁用 any 类型检查
      '@typescript-eslint/no-explicit-any': 'off',
      // 禁用与 Prettier 冲突的尾随逗号规则
      '@stylistic/comma-dangle': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      // 允许在 TypeScript 类型中使用分号作为分隔符
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          }
        }
      ],
      // 禁用 stylistic 的成员分隔符规则，避免冲突
      '@stylistic/member-delimiter-style': 'off'
    }
  }
])
