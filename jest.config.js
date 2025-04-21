module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@expo|expo(nent)?|expo-font|expo-modules-core|expo-asset|expo-file-system|expo-constants|expo-linear-gradient|expo-status-bar|unimodules|@unimodules)/)"
      ],            
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'jsdom',
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    moduleNameMapper: {
        'react-native-reanimated': '<rootDir>/__mocks__/react-native-reanimated.js',
      },
  };
  