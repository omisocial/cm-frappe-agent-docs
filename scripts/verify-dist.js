import fs from 'fs';

const required = [
  'docs/.vitepress/dist/index.html',
  'docs/.vitepress/dist/404.html',
  'docs/.vitepress/dist/assets', // check if the assets folder exists
];

const missing = required.filter(f => !fs.existsSync(f));

if (missing.length > 0) {
  console.error('❌ Missing files in dist/:');
  missing.forEach(f => console.error('  ' + f));
  process.exit(1);
}

console.log('✅ All critical files present in dist/');
