// Configurações de autenticação para testes Cypress
const authConfig = {
  // URL do servidor DHIS2
  baseUrl: 'http://localhost:8080',

  // Credenciais padrão (altere conforme seu ambiente)
  defaultCredentials: {
    username: 'admin',
    password: 'district'
  },

  // Seletores do formulário de login
  loginSelectors: {
    serverInput: 'input#server[name="server"]',
    usernameInput: 'input#j_username[name="j_username"]',
    passwordInput: 'input#j_password[name="j_password"]',
    submitButton: 'button[data-test="dhis2-adapter-loginsubmit"]'
  },

  // Configurações de timeout
  timeouts: {
    login: 10000,
    pageLoad: 10000
  }
}

module.exports = authConfig
