const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const sharedPackageRoot = path.resolve(projectRoot, 'packages/antifragil-shared-api');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [sharedPackageRoot],
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
