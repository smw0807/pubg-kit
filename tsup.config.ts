import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    nestjs: 'src/nestjs/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['@nestjs/common', '@nestjs/core'],
});
