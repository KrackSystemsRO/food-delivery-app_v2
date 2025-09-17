import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@fastify|brace-expansion|balanced-match|minimatch|glob|@sinclair/typebox)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

export default config;
