// Arquivo de configuração para testes E2E
// IMPORTANTE: Nunca commit credenciais reais em repositórios públicos
// Use variáveis de ambiente para dados sensíveis

const config = {
  // URL base do servidor DHIS2
  baseUrl: process.env.DHIS2_BASE_URL || 'https://emis.im.dhis2.org/dev42',
  
  // Credenciais de teste
  credentials: {
    username: process.env.DHIS2_USERNAME || 'admin',
    password: process.env.DHIS2_PASSWORD || 'district'
  },
  
  // Configurações do Cypress
  cypress: {
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
}

module.exports = config