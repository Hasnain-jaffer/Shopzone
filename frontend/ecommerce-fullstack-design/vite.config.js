import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    port: 3001,
  open: true, } // automatically open the app in the browser when the server starts
})

// npm install tailwindcss @tailwindcss/vite