/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

  Cypress.Commands.add('resetDatabase', () => {
    return cy.exec('docker exec some-postgres bash -c "psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/init.sql"')
  });

  // const user = {
  //   email: "already.exist@mail.com",
  //   password: "testtesttest",
  // }

  // TODO should just set a cookie 
  Cypress.Commands.add('login', (email = 'already.exist@mail.com', password = 'testtesttest') => {
    cy.visit('/login')
    cy.resetDatabase()
    cy.get('[data-test="email-input"]').as('emailInput')
    cy.get('[data-test="password-input"]').as('passwordInput')
    cy.get('[data-test="login-button"]').as('loginButton')
    
    cy.intercept('POST', '/api/login').as('login')
      
    cy.get('@emailInput').type(email)
    cy.get('@passwordInput').type(password)
    cy.get('@loginButton').click()
    cy.wait('@login');
  });

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<Response<unknown>>
      resetDatabase(): Chainable<Exec>
    }
  }
}
