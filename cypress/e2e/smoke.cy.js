describe('Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/')
    // This is a simple smoke test. Depending on the environment, 
    // it might redirect to the login page or show the app.
    // If it's running with the DHIS2 App Adapter, it might show the header bar.
    cy.get('body').should('be.visible')
  })
})
