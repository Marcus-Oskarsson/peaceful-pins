import { When, Then, Given, Before } from '@badeball/cypress-cucumber-preprocessor'

Before(() => {
  cy.resetDatabase()
  cy.login()
  cy.intercept('GET', '/api/friends', { fixture: 'friends.json' }).as('getFriends')
})

Given('I\'m visiting the profile page', () => {
  cy.visit('/profile')
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

