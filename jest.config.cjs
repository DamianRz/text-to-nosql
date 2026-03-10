const sharedConfig = {
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          target: "ES2022",
          module: "commonjs",
          jsx: "react-jsx",
          esModuleInterop: true
        }
      }
    ]
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"]
};

module.exports = {
  projects: [
    {
      ...sharedConfig,
      displayName: "node",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/**/*.test.ts"]
    },
    {
      ...sharedConfig,
      displayName: "jsdom",
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/src/**/*.test.tsx"]
    }
  ]
};
