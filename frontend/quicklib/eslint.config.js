// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const checkFile = require('eslint-plugin-check-file');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    ignores: ['src/api/**'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/!(_layout).{js,ts,jsx,tsx}': 'KEBAB_CASE',
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Prevent features from importing from app
            {
              target: './src/features',
              from: './src/app',
            },
            // Prevent shared from importing from features or app
            {
              target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
                './src/assets',
                './src/styles',
                './src/services',
                './src/config',
              ],
              from: ['./src/features', './src/app'],
            },
            // Forbid cross-feature imports (only allow self-imports)
            {
              target: './src/features/book-info',
              from: './src/features',
              except: ['./book-info'],
            },
            {
              target: './src/features/book-list',
              from: './src/features',
              except: ['./book-list'],
            },
            {
              target: './src/features/google-sign-in',
              from: './src/features',
              except: ['./google-sign-in'],
            },
            {
              target: './src/features/manage-book',
              from: './src/features',
              except: ['./manage-book'],
            },
          ],
        },
      ],
      // Disallow default export
      'import/no-default-export': ['error'],
    },
  },
  {
    // Allow default export in src/app
    files: ['src/app/**/*.{js,ts,jsx,tsx}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]);
