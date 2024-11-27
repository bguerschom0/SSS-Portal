import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'recharts': 'recharts/lib/recharts'
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['recharts'],  // Add recharts to external
      output: {
        manualChunks: {
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'firebase/app', 
      'firebase/auth', 
      'firebase/firestore',
      'recharts',  
      'recharts/lib/recharts'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  server: {
    host: true
  }
})
