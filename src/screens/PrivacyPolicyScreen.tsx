import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { PRIVACY_POLICY_HTML } from '../privacyPolicyHtml';

function buildDocument(): string {
  const darkOverrides = `
<style id="antifragil-dark-overrides">
  html, body {
    background: #050505 !important;
    color: #c0c0c0 !important;
  }
  [data-custom-class='body'], [data-custom-class='body'] * {
    background: transparent !important;
  }
  [data-custom-class='title'] h1,
  [data-custom-class='title'] * {
    color: #ffffff !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }
  [data-custom-class='subtitle'],
  [data-custom-class='subtitle'] * {
    color: #888888 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }
  [data-custom-class='heading_1'] h2,
  [data-custom-class='heading_1'] * {
    color: #ff69b4 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }
  [data-custom-class='heading_2'] h3,
  [data-custom-class='heading_2'] * {
    color: #e8e8e8 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }
  [data-custom-class='body_text'],
  [data-custom-class='body_text'] * {
    color: #a8a8a8 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }
  a,
  [data-custom-class='link'],
  [data-custom-class='link'] * {
    color: #ff69b4 !important;
  }
  table, th, td {
    border-color: #333333 !important;
    color: #a8a8a8 !important;
  }
  ul, ol, li {
    color: #a8a8a8 !important;
  }
</style>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/></head><body style="margin:0;padding:12px 16px 32px;background:#050505;">${PRIVACY_POLICY_HTML}${darkOverrides}</body></html>`;
}

export function PrivacyPolicyScreen() {
  const html = useMemo(() => buildDocument(), []);

  return (
    <View style={styles.root}>
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: '' }}
        style={styles.web}
        setSupportMultipleWindows={false}
        nestedScrollEnabled
        overScrollMode="content"
        androidLayerType="hardware"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },
  web: { flex: 1, backgroundColor: '#050505' },
});
