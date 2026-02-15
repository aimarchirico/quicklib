#!/usr/bin/env node
// generate-api.js
// Loads API URL from .env and runs the OpenAPI generator CLI.
// Supports Cloudflare Access service tokens for protected endpoints.

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Load dotenv if available
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch (e) {
  // ignore
}

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  console.error('ERROR: API_URL not set');
  process.exit(1);
}

const cfClientId = process.env.CF_ACCESS_CLIENT_ID;
const cfClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;

console.log('Generating API client from', apiUrl);

async function fetchSpec() {
  const specUrl = `${apiUrl}/v3/api-docs`;
  const headers = {};
  
  if (cfClientId && cfClientSecret) {
    console.log('Using Cloudflare Access service token');
    headers['CF-Access-Client-Id'] = cfClientId;
    headers['CF-Access-Client-Secret'] = cfClientSecret;
  }

  return new Promise((resolve, reject) => {
    const client = specUrl.startsWith('https') ? https : http;
    const req = client.get(specUrl, { headers }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch spec: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

async function main() {
  try {
    const spec = await fetchSpec();
    const specPath = path.resolve(process.cwd(), 'openapi-spec.json');
    fs.writeFileSync(specPath, spec);

    const cmd = `rm -rf src/api/generated && npx @openapitools/openapi-generator-cli generate -i ${specPath} -g typescript-axios -o src/api/generated`;
    execSync(cmd, { stdio: 'inherit', cwd: path.resolve(process.cwd()) });
    
    fs.unlinkSync(specPath);
    console.log('OpenAPI client generated at src/api/generated');
  } catch (e) {
    console.error('OpenAPI generation failed:', e.message || e);
    process.exit(2);
  }
}

main();