import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleFileExtensions: ['ts','tsx','js','jsx'],
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }], // <-- fix "React is not defined"
        '@babel/preset-typescript'
      ]
    }]
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests-e2e/'], // <-- keep Playwright out of Jest
}

export default config
