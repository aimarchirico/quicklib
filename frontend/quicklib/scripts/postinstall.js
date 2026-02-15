#!/usr/bin/env node
// postinstall.js - Generate API client if API_URL is set (for CI/CD builds)

// Load dotenv if available
try {
  require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
} catch (e) {
  // ignore
}

console.log('Running postinstall script...');

if (process.env.API_URL) {
  const { execSync } = require('child_process');
  console.log('API_URL detected, generating API client...');
  execSync('npm run api:generate', { stdio: 'inherit' });
  console.log('API client generation completed.');
} else {
  console.log('API_URL not set, skipping API client generation.');
}