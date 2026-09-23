import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
