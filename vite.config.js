import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv(process.env.NODE_ENV, process.cwd());

  return {
    // Set the host from environment variable
    base: env.VITE_APP_BASE_URL,

    // Vite plugins
    plugins: [
      vue()
    ],

    // Resolve options
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@composables': path.resolve(__dirname, 'src/composables'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@pages': path.resolve(__dirname, 'src/pages'),
      }
    }
  }
})
