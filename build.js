const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('js')) {
  fs.mkdirSync('js');
}

esbuild.build({
  entryPoints: ['src/js/main.js'],
  bundle: true,
  platform: 'browser',
  target: ['es2020'],
  format: 'iife',
  outfile: 'js/bundle.js',
  globalName: 'App'
}).then(function() {
  console.log('Build complete!');
}).catch(function() {
  process.exit(1);
});

