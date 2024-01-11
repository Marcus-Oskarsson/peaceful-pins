/* eslint-disable */
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const {
  addCucumberPreprocessorPlugin
} = require('@badeball/cypress-cucumber-preprocessor')
const {
  createEsbuildPlugin
} = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const { defineConfig } = require('cypress')

const react = require('@vitejs/plugin-react')
const istanbul = require('vite-plugin-istanbul')

module.exports = defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*",
    }
  },
  e2e: {
    baseUrl: 'https://peaceful-pins:5173',
    hosts: {
      'peaceful-pins': '127.0.0.1'
    },
    async setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)]
      })
      on('file:preprocessor', bundler)

      await addCucumberPreprocessorPlugin(on, config)

      return config
    },
    specPattern: [
      // E2E-filer Cypress letar efter som standard
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
      // Tillägg för Cucumber
      'cypress/e2e/**/*.feature'
    ]
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react(), istanbul({
          cypress: true,
          requireEnv: false,
        })],
        resolve: {
          alias: {
            '@styles': '/src/styles',
            '@components': '/src/components',
            '@pages': '/src/pages',
            '@utils': '/src/utils',
            '@assets': '/src/assets',
            '@services': '/src/services',
            '@types': '/src/types/index',
            '@hooks': '/src/hooks',
            '@contexts': '/src/contexts',
          },
        },
        server: {
          proxy: {
            '/api': {
              target: 'http://localhost:3000',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        },
      },
    },
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);

      return config;
    },
  },
})