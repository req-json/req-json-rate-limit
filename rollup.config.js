import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const plugins = [
  resolve(),
  babel(),
];

export default [
  {
    input: 'index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    external: [
      '@req-json/serialize-request',
      'async-throttle-cache',
    ],
    plugins,
  },
  {
    input: 'index.js',
    output: [
      {
        name: 'reqJSONRateLimit',
        file: pkg.unpkg,
        format: 'umd',
      },
    ],
    plugins,
  },
];
