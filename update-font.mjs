#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fetch URL with a modern User-Agent to get woff2 format
function fetchUrl(url, userAgent = null) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: userAgent ? { 'User-Agent': userAgent } : {},
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
      });
    }).on('error', reject);
  });
}

// Fetch binary data (for woff2 font file)
function fetchBinary(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
      });
    }).on('error', reject);
  });
}

// Extract woff2 URL from CSS
function extractWoff2Url(css) {
  // Match url() declarations in @font-face blocks
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g);
  if (!match || match.length === 0) {
    throw new Error('No woff2 URL found in Google Fonts CSS');
  }

  // Take the last one (largest/most complete subset) or any - for variable icon font they're all the same
  const lastMatch = match[match.length - 1];
  const urlMatch = lastMatch.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
  if (!urlMatch || urlMatch.length < 2) {
    throw new Error('No woff2 URL found in Google Fonts CSS');
  }
  return urlMatch[1];
}

// Main update function
async function updateFont() {
  try {
    console.log('Fetching Google Fonts CSS for Material Symbols Outlined...');

    // Step 1: Fetch the Google Fonts CSS with modern User-Agent
    const css = await fetchUrl(
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    // Step 2: Parse the woff2 URL
    const woff2Url = extractWoff2Url(css);
    console.log(`Found woff2 URL: ${woff2Url}`);

    // Step 3: Download the woff2 font binary
    console.log('Downloading woff2 font...');
    const fontBinary = await fetchBinary(woff2Url);
    console.log(`Downloaded ${fontBinary.length} bytes`);

    // Step 4: Base64-encode the binary
    const base64 = fontBinary.toString('base64');
    console.log(`Base64 encoded: ${base64.length} characters`);

    // Step 5: Replace the src in styles.css
    const stylesPath = path.join(__dirname, 'styles.css');
    console.log(`Reading ${stylesPath}...`);

    let stylesContent = fs.readFileSync(stylesPath, 'utf-8');

    // Replace the src declaration inside @font-face
    // Target: src: url(data:application/octet-stream;base64,...) or variations with format()
    const srcRegex = /src:\s*url\(data:(?:font\/woff2;base64|application\/octet-stream;base64),[^)]+\)(?:\s*format\([^)]*\))?[^;]*;/;

    if (!srcRegex.test(stylesContent)) {
      throw new Error('Could not find src declaration in styles.css');
    }

    const newSrc = `src: url(data:application/octet-stream;base64,${base64}) format('woff2');`;
    stylesContent = stylesContent.replace(srcRegex, newSrc);

    console.log('Writing updated styles.css...');
    fs.writeFileSync(stylesPath, stylesContent, 'utf-8');

    console.log('✓ Font update completed successfully!');
    console.log(`✓ Updated base64 size: ${base64.length} characters (original ~3MB woff2 file)`);
  } catch (error) {
    console.error('✗ Error updating font:', error.message);
    process.exit(1);
  }
}

updateFont();
