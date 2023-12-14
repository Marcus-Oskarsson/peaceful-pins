/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import cypress = require("cypress");

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
    return cy.exec('docker exec some-postgres psql -U postgres -d postgres -f init.sql')
  });

  Cypress.Commands.add('login', () => { 
    return cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: "test@test.test",
        password: "testtesttest",
      },
    })
   })

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<Response<unknown>>
      resetDatabase(): Chainable<Exec>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}
