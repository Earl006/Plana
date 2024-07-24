const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    experimentalStudio: true, 
    baseUrl: 'http://localhost:4200', 
    supportFile: false,
  },
});
