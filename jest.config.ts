import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
		'^.+.ts$': [
			'ts-jest',
			{
				useESM: true
			}
		]
	},
	extensionsToTreatAsEsm: ['.ts'],
	moduleFileExtensions: ['ts', 'js'],
	moduleNameMapper: {
		'^@/(.*)': '<rootDir>/src/$1',
		'^@utils/(.*)': '<rootDir>/src/utils/$1'
	}
}

export default jestConfig
