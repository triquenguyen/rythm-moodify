import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import cors from 'vite-plugin-cors';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: false
    },
  }
})
