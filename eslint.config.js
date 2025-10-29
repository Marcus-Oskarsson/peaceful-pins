// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import cypress from 'eslint-plugin-cypress';
import globals from 'globals';

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["frontend/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { "allowConstantExport": true }],
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
  },
  {
    files: ["frontend/cypress/**/*.{js,jsx,ts,tsx}"],
    plugins: {
        cypress
    },
    rules: {
        ...cypress.configs.recommended.rules
    },
    languageOptions: {
      globals: {
        ...cypress.configs.recommended.globals
      }
    }
  },
  {
    files: ['backend/**/*.js', 'backend/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs
      },
    },
    rules: {
      'node/no-unpublished-require': 'off',
      'node/no-unpublished-import': 'off',
      'node/no-missing-import': 'off',
    },
  }
];
