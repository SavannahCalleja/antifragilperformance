module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/env.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens|react-native-gesture-handler|react-native-webview|react-native-safe-area-context|react-native-url-polyfill|whatwg-url-without-unicode|@antifragil)/)',
  ],
};
