// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['./dist/*', './src/api/*'],
    rules: {
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
    },
  },
]);
