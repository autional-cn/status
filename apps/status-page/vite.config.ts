import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
function normalizeViteBase(p: string | undefined): string {
  if (!p || p === '/') return '/';
  if (p.includes('Program Files')) {
    throw new Error('MSYS2 path corruption detected on BASE_PATH: ' + p + '. Use PowerShell to build.');
  }
  return p.replace(/\/$/, '') + '/';
}

const API_PROXY_TARGET = process.env.VITE_API_PROXY_URL || 'http://localhost:11080';

export default defineConfig({
  base: normalizeViteBase(process.env.BASE_PATH),
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Autional Status',
        short_name: 'Autional Status',
        description: 'Autional 系统状态页面 — 实时查看所有服务运行状态与维护公告',
        start_url: normalizeViteBase(process.env.BASE_PATH || '/'),
        display: 'standalone',
        background_color: '#f8fbfe',
        theme_color: '#003153',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:11080\/health/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'health-api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    extensions: ['.mjs', '.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {'@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 13106,
    proxy: {
      '/health': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
      '/ready': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
      '/bff': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 13106,
    proxy: {
      '/health': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
      '/ready': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
      '/bff': {
        target: process.env.VITE_API_PROXY_URL || 'http://localhost:11080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
