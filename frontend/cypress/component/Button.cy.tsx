import { Button } from '../../src/components/shared/Button'

type Variants = 'primary' | 'success' | 'danger';
const variants: Variants[] = ['primary', 'success', 'danger'];

describe('Button.cy.tsx', () => {
  variants.forEach(variant => {
    it(`Mounts button with class ${variant} and text ${variant}`, () => {
      cy.mount(<Button variant={variant}>{variant}</Button>)
      cy.get('button').should('have.class', `btn-${variant}`)
      cy.get('button').should('have.text', variant)
    })
  });

  it('Button with no variant prop defaults to primary', () => {
    cy.mount(<Button>Primary</Button>)
    cy.get('button').should('have.class', 'btn-primary')
    cy.get('button').should('have.text', 'Primary')
  })

  it('Disabled button has correct class and is disabled', () => {
    cy.mount(<Button disabled={true} variant='disabled'>Disabled</Button>)
    cy.get('button').should('have.class', 'btn-disabled')
    cy.get('button').should('be.disabled')
  })

  it('Button with onClick prop calls function when clicked', () => {
    const onClick = cy.stub()
    cy.mount(<Button onClick={onClick}>Click me</Button>)
    cy.get('button').click().then(() => {expect(onClick).to.be.called})
  })
})