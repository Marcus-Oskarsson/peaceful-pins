import { When, Then, Given, Before } from '@badeball/cypress-cucumber-preprocessor'

Before(() => {
  // cy.resetDatabase()
  // cy.login()
  cy.intercept('POST', '/api/login', { data: { user: {}}, success: true }).as('login')
  cy.intercept('GET', '/api/friends', { fixture: 'friends.json' }).as('getFriends')
  cy.intercept('GET', '/api/auth_check', { data: 'hej', success: true }).as('getUser')
})


Given('I\'m visiting the profile page', () => {
  cy.visit('/profile')
  cy.get('[data-test="email-input"]').as('emailInput')
  cy.get('[data-test="password-input"]').as('passwordInput')
  cy.get('[data-test="login-button"]').as('loginButton')
  cy.get('@emailInput').type('asdasdsad@mail.com')
  cy.get('@passwordInput').type('asasdasdsadsad')
  cy.get('@loginButton').invoke('show').click()
  cy.wait('@login')
  cy.wait('@getUser')
  cy.setCookie('token', 'test')
  cy.url().should('include', '/profile')
})

When('The page loads', () => {
  cy.get('.profile').should('be.visible')
})

Then('Client sends a request for users friends', () => {
  cy.wait('@getFriends').then((interception) => {
    expect(interception.request.url).to.contain('/friends')
  });
})

Then('A list of the users friends are shown', () => {
  cy.wait('@getFriends')
  cy.get('.friend').should('have.length', 10)
})

