/* eslint-disable import/no-extraneous-dependencies */
import { join } from 'node:path';
import { dts } from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';

const dist = 'dist';
const libName = 'esp32part';
const main = 'main';

function bundle(config) {
  return {
    ...config,
    input: join('src', `${main}.ts`),
    external: (id) => !/^[./]/.test(id),
  };
}

export default [
  bundle({
    plugins: [typescript({
      exclude: ['**/*.test.ts'],
    })],

    output: [
      {
        file: join(dist, `${libName}.js`),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: join(dist, `${libName}.mjs`),
        format: 'es',
        sourcemap: true,
      },
    ],
  }),

  bundle({
    plugins: [dts()],
    output: {
      file: join(dist, `${libName}.d.ts`),
      format: 'es',
    },
  }),
];
