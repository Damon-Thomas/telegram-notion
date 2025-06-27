module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // or 'jsdom' for browser environments
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // Optional: Configure ts-jest specific options
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: true, // Set to false to suppress TypeScript diagnostic messages during tests
    },
  },
};
