import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/cesium/Build/Cesium/Workers',
          dest: 'cesium'
        },
        {
          src: 'node_modules/cesium/Build/Cesium/ThirdParty',
          dest: 'cesium'
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Assets',
          dest: 'cesium'
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Widgets',
          dest: 'cesium'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium/')
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/maps': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/notifs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/mess': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
