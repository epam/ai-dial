const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  moduleNameMapper: {
    '^@/custom-app-ui/client/(.*)$': '<rootDir>/../../apps/dial-custom-ui-client/$1',
    '^@/custom-app-ui/admin/(.*)$': '<rootDir>/../../apps/dial-custom-ui-admin/$1',
    '^@/custom-app-ui/common/(.*)$': '<rootDir>/../../libs/common/$1',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!*.config.{js,ts}',
    '!*.d.ts',
    '!**/.next/**',
    '!**/vendor/**',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 1,
      lines: 4,
      statements: 4,
    },
  },
};
