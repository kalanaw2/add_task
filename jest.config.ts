// jest.config.ts
export default {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }] },
  moduleNameMapper: { '\\.(css|less|scss|sass)$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
