declare namespace Cypress {
  interface Chainable {
    resetDatabase(): Chainable<JQuery<HTMLElement>>
  }
}