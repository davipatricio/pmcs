import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['./src/index.ts', './src/versions/*.ts'],
  outDir: 'dist',
  format: options.watch ? 'esm' : ['esm', 'cjs'],
  splitting: false,
  clean: true,
  dts: true
}));
