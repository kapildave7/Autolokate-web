import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@autolokate/brand': path.resolve(rootDir, '../../packages/brand/src'),
      '@autolokate/ui': path.resolve(rootDir, '../../packages/ui/src'),
      '@autolokate/design-system': path.resolve(rootDir, '../../packages/design-system/src'),
      '@autolokate/icons': path.resolve(rootDir, '../../packages/icons/src'),
      '@autolokate/types': path.resolve(rootDir, '../../packages/types/src'),
      '@autolokate/utils': path.resolve(rootDir, '../../packages/utils/src'),
    },
  },
});
