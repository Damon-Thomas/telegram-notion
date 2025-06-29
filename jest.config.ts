/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  resolver: "ts-jest-resolver",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.+(ts|tsx)",
    "<rootDir>/src/**/*.(spec|test).(ts|tsx)",
  ],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: true,
    },
  },
};
