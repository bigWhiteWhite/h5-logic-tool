import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import sourcemaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
// https://www.rollupjs.com
const plugins = [
    resolve({ mainFields: ["jsnext", "preferBuiltins", "browser"] }),
    commonjs({
        browser: true
    }),
    typescript(),
    terser(),
    json(),
    cleanup(),
    sourcemaps(),
    babel({
        exclude: ["node_modules/**"],
        runtimeHelpers: true,
        babelHelpers: 'bundled'
    }),
    alias({
        entries: [
            { find: '@/', replacement: './src/' },
            { find: '@utils', replacement: './src/utils' },
        ]
    })
]
export default defineConfig([
    {
        input: './src/index.ts',
        output: {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: '[name].cjs.js',
        },
        plugins,
    },
    {
        input: './src/index.ts',
        output: {
            dir: 'dist',
            format: 'esm',
            entryFileNames: '[name].esm.js',
        },
        plugins,
    }
])