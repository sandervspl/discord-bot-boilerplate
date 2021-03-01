import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

import pkg from './package.json';

export default {
  input: 'src/core/main.ts',
  external: Object.keys(pkg.dependencies),
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  preserveEntrySignatures: false,
  plugins: [
    json(),
    resolve(),
    commonjs(),
    dynamicImportVars(),
    typescript(),
    typescriptPaths(),
    replace({
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
      'process.env.NAME': JSON.stringify(process.env.npm_package_name),
    }),
  ],
};
