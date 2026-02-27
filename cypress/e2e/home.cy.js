describe('Home Page', () => {
  beforeEach(() => {
    // Auto-login configurado pelo @dhis2/cypress-commands no suporte
    // Apenas visita a aplicação na rota /semis
    cy.visit('/semis')
  })

  it('deve renderizar as seções principais do dashboard', () => {
    // Intercepta a requisição de menu para aguardar o carregamento dos dados
    cy.intercept('GET', '**/api/**').as('apiRequests')

    // Aguarda o título "Student" aparecer com um timeout maior se necessário
    cy.contains('Student', { timeout: 30000 }).should('be.visible')
    cy.contains('Staff').should('be.visible')
    cy.contains('Configurations').should('be.visible')
  })

  it('deve renderizar os cards de estudantes', () => {
    // Verifica se os labels dos cards de estudantes estão presentes
    cy.contains('Enrollment').should('be.visible')
    cy.contains('Attendance').should('be.visible')
    cy.contains('Performance').should('be.visible')
    cy.contains('Transfer').should('be.visible')
    cy.contains('Final Result').should('be.visible')
  })

  it('deve navegar para matriculas ao clicar na ação de Enrollment', () => {
    // Intercepta a chamada de API para garantir que os dados carreguem
    cy.intercept('GET', '**/api/trackedEntityInstances**').as('loadEnrollments')

    // Pequena pausa para estabilidade visual
    cy.wait(1000)

    // Busca o card que contém o texto 'Enrollment' e clica no botão dentro dele
    cy.contains('[data-test="dhis2-uicore-card"]', 'Enrollment')
      .find('button')
      .click()

    // Aguarda o carregamento da página de matrículas
    // cy.wait('@loadEnrollments', { timeout: 10000 })

    cy.url().should('include', '/semis/enrollments')
    cy.url().should('include', 'sectionType=student')
  })

  it('deve navegar para configurações ao clicar na ação de Configurations', () => {
    // Intercepta a chamada de configuração
    cy.intercept('GET', '**/api/dataStore/semis/**').as('loadConfigs')

    cy.wait(1000)

    // Mesmo padrão para o card de configurações
    cy.contains('[data-test="dhis2-uicore-card"]', 'Configurations')
      .find('button')
      .click()

    // Aguarda carregar as configurações
    // cy.wait('@loadConfigs', { timeout: 10000 })

    cy.url().should('include', '/semis/configuration')
  })

})
