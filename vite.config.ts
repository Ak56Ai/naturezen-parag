import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  css: {
    postcss: './postcss.config.js',
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    watch: {
      usePolling: true,
    },
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});