/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.e2e.ts$',
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  //rootDir: "./", //не обязательно
  testTimeout: 100000, //не обязательно
};