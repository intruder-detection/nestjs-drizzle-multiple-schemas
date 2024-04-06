import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e.ts', '**/*.spec.ts', '**/*.test.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-tests.ts'],
    snapshotFormat: {
      printBasicPrototype: true,
      printFunctionName: true,
      escapeString: true,
    },
  },
  plugins: [swc.vite(), tsconfigPaths()],
});
