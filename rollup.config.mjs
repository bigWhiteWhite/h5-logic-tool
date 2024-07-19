import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import sourcemaps from 'rollup-plugin-sourcemaps'
import builtins from 'rollup-plugin-node-builtins'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
// import multi from '@rollup/plugin-multi-entry'
// https://www.rollupjs.com
export default defineConfig([
	{
		input: ['src/index.ts'], // ['src/index.ts', 'src/utils/**/*.ts']
		output: [
			{
				dir: 'dist',
				format: 'cjs',
				entryFileNames: '[name].cjs.js'
			},
			{
				dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
			},
			{
				dir: 'dist',
        format: 'umd',
        entryFileNames: '[name].umd.js',
				name: 'FE_utils', // umd模块名称，相当于一个命名空间，会自动挂载到window下面
			},
		],
		plugins: [
			// 帮助 Rollup解析 Node.js 模块,让 Rollup 可以找到并打包这些模块。
			resolve({ mainFields: ['jsnext', 'preferBuiltins', 'browser'] }),
			// 将 CommonJS模块(module.exports)转换为 ES 模块,CommonJS 是 Node.js 默认的模块规范。
			commonjs(),
			typescript({
				exclude: ['node_modules/**']
			}),
			terser({
				compress: {
					drop_console: process.env.BUILD_ENV === 'prod'
				}
			}),
			json(),
			builtins(),
			cleanup(),
			sourcemaps(),
			// multi({
			// 	entryFileName: '[name].js'
			// }),
			babel({
				exclude: ['node_modules/**'],
				babelHelpers: 'bundled'
			}),
			alias({
				entries: [
					{ find: '@/', replacement: './src/' },
					{ find: '@utils', replacement: './src/utils' }
				]
			})
		]
	}
])
