//testPathIgnorePatterns - Jest nao procurar testes dentro dessas pastas.
//setupFilesAfterEnv - arquivos que estao localizados os tests.
//transforms - Jest intender os arquivos que estao em TS e converter eles em JS. e passa para o jest aonde esta o babel para ele verificar os test.
//testEnvironment - qual ambiente os tests estao sendo executados,
//moduleNameMapper - Lidar com arquivos scss

module.exports = {
  testPathIgnorePatterns: ["/node_modules", "/.next/"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{tsx}", "!src/**/*.spec.tsx"],
  coverageReporters: ["lcov", "json"],

  testEnvironment: "jsdom",
};
