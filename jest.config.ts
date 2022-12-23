export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: ["@shelf/jest-mongodb"],
  testEnvironment: "node",

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
