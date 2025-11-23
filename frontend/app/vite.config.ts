import { defineConfig } from 'vite'
import fukict from '@fukict/vite-plugin'

export default defineConfig({
  plugins: [fukict()],
})
