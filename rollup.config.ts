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
// https://www.rollupjs.com
const plugins = [
	// 帮助 Rollup解析 Node.js 模块,让 Rollup 可以找到并打包这些模块。
	resolve({ mainFields: ['jsnext', 'preferBuiltins', 'browser'] }),
	// 将 CommonJS模块(module.exports)转换为 ES 模块,CommonJS 是 Node.js 默认的模块规范。
	commonjs(),
	typescript(),
	terser({
		compress: {
			drop_console: process.env.BUILD_ENV === 'prod'
		}
	}),
	json(),
	cleanup(),
	builtins(),
	sourcemaps(),
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
export default defineConfig([
	{
		input: './src/index.ts',
		output: {
			dir: 'dist',
			format: 'cjs',
			entryFileNames: '[name].cjs.js'
		},
		plugins
	},
	{
		input: './src/index.ts',
		output: {
			dir: 'dist',
			format: 'esm',
			entryFileNames: '[name].esm.js'
		},
		plugins
	}
])
