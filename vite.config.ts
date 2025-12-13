// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'
// import tailwindcss from "@tailwindcss/vite"

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   root: __dirname,
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//       "@shared": path.resolve(__dirname, "../shared"),
//       "@assets": path.resolve(__dirname, "src/assets"),
//     },
//   },
// });



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: __dirname,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    host: true, // ✅ Allow external access
    allowedHosts: ['all'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/openai': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/downloads': {  // ✅ ADD THIS for YouTube downloads
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});