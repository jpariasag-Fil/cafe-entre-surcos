import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // Esto obliga a que todo el CSS se una en un solo archivo
  }
})