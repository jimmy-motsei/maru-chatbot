import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'api-handlers': 'lib/api-handlers.ts',
  },
  format: ['esm', 'cjs'],
  dts: false, // Disable for now due to incremental config conflict
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    'framer-motion',
    'lucide-react',
  ],
  treeshake: true,
  minify: false,
});
