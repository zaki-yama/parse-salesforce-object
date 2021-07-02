module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  coverageReporters: ["lcov", "text-summary"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
