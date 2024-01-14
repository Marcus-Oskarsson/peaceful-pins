
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.resetDatabase()

    cy.get('[data-test="email-input"]').as('emailInput')
    cy.get('[data-test="password-input"]').as('passwordInput')
    cy.get('[data-test="login-button"]').as('loginButton')
  })

  it('logs in with correct credentials', () => {
    cy.intercept('POST', '/api/login').as('login')
    
    cy.get('@emailInput').type('already.exist@mail.com')
    cy.get('@passwordInput').type('testtesttest')
    cy.get('@loginButton').click()

    cy.wait('@login');
    cy.getCookie('token').should('exist')
    cy.url().should('include', '/profile')
  });

  it('gives error message on wrong credentials', () => {
    cy.intercept('POST', '/api/login', {statusCode: 401, body: {error: "Username or password is incorrect", success: false}}).as('login')
    cy.get('@emailInput').type('finns-ej@mail.com')
    cy.get('@passwordInput').type('fel-lösen')
    cy.get('@loginButton').click()
    cy.wait('@login');
    cy.get('[data-test="error-message"]').should('exist')
  })

  it('gives correct error message on missing inputs', () => {
    cy.get('@loginButton').click()
    cy.get('[data-test="error-message"]').as('errorMessage')
    cy.get('@errorMessage').should('contain', 'Email is required')
    cy.get('@errorMessage').should('contain', 'Password is required')
  });

  // Mock slow response from backend
  it('shows loading indicator', () => {
    cy.intercept('POST', '/api/login', {fixture: 'login', delay: 3000}).as('login')
    cy.get('@emailInput').type('already.exist@mail.com')
    cy.get('@passwordInput').type('testtesttest')
    cy.get('@loginButton').click()
    cy.get('[data-test="loading-indicator"]').should('exist')
    cy.wait('@login');
    cy.get('[data-test="loading-indicator"]').should('not.exist')
  })
})