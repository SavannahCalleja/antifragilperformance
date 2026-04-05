/**
 * @format
 */

// Must run before @supabase/* loads: RN's URL has read-only `protocol`; Supabase mutates it for Realtime.
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
