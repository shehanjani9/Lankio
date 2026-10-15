// Verifies that every locale file has exactly the same message keys (and the
// same array lengths) as English. Run with: npm run check:i18n
import { readFileSync } from 'node:fs';

const LOCALES = ['en', 'it'];
const load = (locale) => JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'));

function shape(value, path = '', out = new Map()) {
  if (Array.isArray(value)) {
    out.set(path, `array(${value.length})`);
    value.forEach((item, i) => shape(item, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) shape(child, path ? `${path}.${key}` : key, out);
  } else {
    out.set(path, typeof value);
    if (typeof value === 'string' && value.trim() === '') out.set(`${path}::empty`, 'empty');
  }
  return out;
}

const [base, ...others] = LOCALES;
const reference = shape(load(base));
let problems = 0;

for (const locale of others) {
  const current = shape(load(locale));
  for (const [key, kind] of reference) {
    if (!current.has(key)) (problems++, console.error(`[${locale}] missing: ${key}`));
    else if (current.get(key) !== kind) (problems++, console.error(`[${locale}] shape mismatch at ${key}: ${current.get(key)} vs ${kind}`));
  }
  for (const key of current.keys()) {
    if (!reference.has(key)) (problems++, console.error(`[${locale}] extra key: ${key}`));
  }
}

if (problems > 0) {
  console.error(`\n${problems} problem(s) found.`);
  process.exit(1);
}
console.log(`Messages OK: ${LOCALES.join(', ')} share ${reference.size} keys.`);
