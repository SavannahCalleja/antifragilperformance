import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'legal', 'privacy-policy.html');
const outPath = path.join(root, 'src', 'privacyPolicyHtml.ts');

const html = fs.readFileSync(htmlPath, 'utf8');
fs.writeFileSync(
  outPath,
  `export const PRIVACY_POLICY_HTML = ${JSON.stringify(html)} as const;\n`,
);
console.log('Wrote', outPath, `(${html.length} chars)`);
