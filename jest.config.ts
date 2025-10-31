import type { Config } from 'jest'
const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleFileExtensions: ['ts','tsx','js','jsx'],
  transform: { '^.+\\.(t|j)sx?$': ['babel-jest', { presets: ['@babel/preset-env','@babel/preset-react','@babel/preset-typescript'] }] },
}
export default config
