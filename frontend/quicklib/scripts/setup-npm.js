const fs = require('fs');
const path = require('path');

// Load dotenv if available
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch (e) {
  // ignore
}

const npmToken = process.env.GITHUB_NPM_TOKEN;
if (!npmToken) {
  console.error('GITHUB_NPM_TOKEN environment variable is not set');
  process.exit(1);
}

const npmrcContent = `//npm.pkg.github.com/:_authToken=${npmToken}
@react-native-google-signin:registry=https://npm.pkg.github.com/
`;

const npmrcPath = path.resolve(process.cwd(), '.npmrc');
fs.writeFileSync(npmrcPath, npmrcContent);
console.log('.npmrc file created with GitHub NPM token');