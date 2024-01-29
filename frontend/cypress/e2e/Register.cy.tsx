
describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register')
    // cy.resetDatabase()

    cy.get('[data-test="firstname-input"]').as('firstnameInput')
    cy.get('[data-test="lastname-input"]').as('lastnameInput')
    cy.get('[data-test="email-input"]').as('emailInput')
    cy.get('[data-test="password-input"]').as('passwordInput')
    cy.get('[data-test="register-button"]').as('registerButton')
  })

  // E2E test for register happy path
  // it('register a new user', () => {
  //   cy.intercept('POST', '/api/register').as('register')
    
  //   cy.get('@firstnameInput').type('Test')
  //   cy.get('@lastnameInput').type('Testsson')
  //   cy.get('@emailInput').type('doesnot.exist@mail.com')
  //   cy.get('@passwordInput').type('testtesttest')
  //   cy.get('@registerButton').click()

  //   cy.wait('@register');
  //   cy.getCookie('token').should('exist')
  //   cy.url().should('include', '/profile')
  // });

  // Mock error response from backend
  it('gives error message when trying to sign up with already used email', () => {
    cy.intercept('POST', '/api/register', {statusCode: 409, body: {error: "Username or email already exists", success: false}}).as('register')
    cy.get('@firstnameInput').type('Test')
    cy.get('@lastnameInput').type('Testsson')
    cy.get('@emailInput').type('already.exist@mail.com')
    cy.get('@passwordInput').type('thisisjustatestpassword')
    cy.get('@registerButton').click()
    cy.wait('@register');
    cy.get('[data-test="error-message"]').should('contain', 'Username or email already exists')
  })

  // Mock slow response from backend
  it('shows loading indicator', () => {
    cy.intercept('POST', '/api/register', {fixture: 'login', delay: 3000}).as('register')
    cy.get('@firstnameInput').type('Test')
    cy.get('@lastnameInput').type('Testsson')
    cy.get('@emailInput').type('doesnot.exist@mail.com')
    cy.get('@passwordInput').type('testtesttest')
    cy.get('@registerButton').click()
    cy.get('[data-test="loading-indicator"]').should('exist')
    cy.wait('@register');
    cy.get('[data-test="loading-indicator"]').should('not.exist')
  })
})