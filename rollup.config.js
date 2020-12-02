import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

export default [
    {
        input: pkg.module,
        plugins: [
            resolve(),
            commonjs(),
            terser(),
            copy({
                targets: [
                    { src: 'src/img/**', dest: 'dist/img' },
                    { src: 'src/**.css', dest: 'dist' },
                ],
            }),
        ],
        output: {
            file: pkg.main,
            format: 'umd',
            exports: 'named',
            name: 'additionalTools',
            sourcemap: process.env.NODE_ENV !== 'production',
        },
    },
];
