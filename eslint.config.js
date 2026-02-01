import js from '@eslint/js'
import globals from 'globals'

/**
 * ESLint Flat Config for DeepLX
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 *
 * Style: Single quotes, no semi, trailing comma
 * Reference: https://github.com/antfu/eslint-config
 */
export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/.edgeone/',
      '**/frontend/',
      '**/public/assets/',
      '**/*.min.js',
    ],
  },

  // Base config
  js.configs.recommended,

  // Main config
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // EdgeOne runtime globals
        deeplx: 'readonly',
      },
    },
    rules: {
      // Error prevention
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',
      'no-debugger': 'error',
      'no-constant-condition': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],

      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'multi-line', 'consistent'],
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'require-await': 'off', // EdgeOne handlers require async signature
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',

      // Style (aligned with Prettier)
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'quote-props': ['error', 'as-needed'],
    },
  },
]
