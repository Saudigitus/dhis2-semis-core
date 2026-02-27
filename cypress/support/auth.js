// Comandos customizados para login e configuração
const authConfig = require('./auth.config')

// Comando de login via App Adapter (Server / Username / Password)
// OBS: Não sobrescreve o cy.login() do @dhis2/cypress-commands
//      Use cy.loginViaAdapter() quando quiser autenticar pela UI
Cypress.Commands.add('loginViaAdapter', (username, password) => {
  const user = username || authConfig.defaultCredentials.username
  const pass = password || authConfig.defaultCredentials.password

  cy.session([user, pass, authConfig.baseUrl], () => {
    cy.visit('/')

    // Aguarda o formulário de login aparecer
    cy.get(authConfig.loginSelectors.serverInput, {
      timeout: authConfig.timeouts.login,
    }).should('be.visible')

    cy.get(authConfig.loginSelectors.serverInput)
      .clear()
      .type(authConfig.baseUrl)

    cy.get(authConfig.loginSelectors.usernameInput)
      .clear()
      .type(user)

    cy.get(authConfig.loginSelectors.passwordInput)
      .clear()
      .type(pass)

    cy.get(authConfig.loginSelectors.submitButton).click()

    // Aguarda o carregamento da aplicação após o login
    cy.get('body', { timeout: authConfig.timeouts.pageLoad }).should('be.visible')
  })
})

// Comando para verificar se está autenticado
Cypress.Commands.add('isAuthenticated', () => {
  cy.getCookie('JSESSIONID').should('exist')
})

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.visit('/dhis-web-commons-security/logout.action')
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Comando para navegar com autenticação
Cypress.Commands.add('visitAuthenticated', (url) => {
  cy.login()
  cy.visit(url)
})

// Comando para login com credenciais específicas via Adapter
Cypress.Commands.add('loginAs', (userRole) => {
  const credentials = {
    admin: { username: 'admin', password: 'district' },
    user: { username: 'user', password: 'password' }
  }

  const creds = credentials[userRole] || credentials.admin
  cy.loginViaAdapter(creds.username, creds.password)
})
