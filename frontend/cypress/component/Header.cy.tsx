import { Header } from '../../src/components/Header'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../src/utils/queryClient';


describe('Header.cy.tsx', () => {
  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Header />
        </QueryClientProvider>
      </BrowserRouter>
    )
  })
  it('Header mounts hamburger on screens with width <= 768', () => {
    cy.viewport(768, 500)
    cy.get('.hamburger-react').should('exist')
  })

  it('Header mounts normal nav links on screens with width > 768', () => {
    cy.viewport(769, 500)
    cy.get('.hamburger-react').should('not.exist')
  })

  it('Opens mobile nav when hamburger is clicked', () => {
    cy.viewport(768, 500)
    cy.get('.nav-main').should('not.be.visible')
    cy.get('.hamburger-react').click()
    cy.get('.nav-main').should('be.visible')
  })
})