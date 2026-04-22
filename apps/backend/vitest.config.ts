import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: 'file:./dev.db',
      APP_SECRET: '12345678901234567890123456789012',
    }
  }
})
