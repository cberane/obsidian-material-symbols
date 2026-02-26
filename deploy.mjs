#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const deployDir = path.join(__dirname, 'deploy');
const files = ['manifest.json', 'main.js', 'styles.css'];

// 1. Ensure deploy/ exists (create or reuse)
fs.mkdirSync(deployDir, { recursive: true });

// 2. Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit', cwd: __dirname });

// 3. Update Material Symbols font
console.log('\nUpdating Material Symbols font...');
execSync('node update-font.mjs', { stdio: 'inherit', cwd: __dirname });

// 4. Run the production build
console.log('\nRunning npm run build...');
execSync('npm run build', { stdio: 'inherit', cwd: __dirname });

// 5. Copy deployment files
console.log('\nCopying files to deploy/...');
for (const file of files) {
  fs.copyFileSync(path.join(__dirname, file), path.join(deployDir, file));
  console.log(`Copied ${file} → deploy/${file}`);
}

console.log('\n✓ Full deployment complete. Files are in deploy/');
