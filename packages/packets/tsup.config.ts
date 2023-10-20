import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/versions/*.ts'],
  outDir: 'dist',
  format: options.watch ? 'esm' : ['esm', 'cjs'],
  splitting: false,
  clean: true,
  dts: true,
}));
