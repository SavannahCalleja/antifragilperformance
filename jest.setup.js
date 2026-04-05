/* eslint-env jest */
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return {
    WebView: View,
  };
});
