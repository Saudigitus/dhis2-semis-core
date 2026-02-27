const { defineConfig } = require('cypress')
const plugins = require('@dhis2/cypress-plugins')

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            if (typeof plugins.networkCookiePlugin === 'function') {
                plugins.networkCookiePlugin(on, config)
            } else if (typeof plugins.chromeAllowInsecureCypressEnv === 'function') {
                plugins.chromeAllowInsecureCypressEnv(on, config)
            }
            
            // As variáveis de ambiente (dhis2BaseUrl, dhis2Username, dhis2Password)
            // devem ser configuradas no arquivo cypress.env.json para maior flexibilidade
            // seguindo o padrão do scorecard-app e do DHIS2.
            
            return config
        },
        baseUrl: 'http://localhost:3000', // Sua aplicação na porta 3000
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 30000,
        requestTimeout: 30000,
        responseTimeout: 30000,
        pageLoadTimeout: 60000,
        // Configuração da porta do Cypress
        port: 3001,
        // Host para o servidor do Cypress
        host: 'localhost'
    },
})
