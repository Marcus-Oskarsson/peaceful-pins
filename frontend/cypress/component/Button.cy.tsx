import { Button } from '../../src/components/shared/Button'

type Variants = 'primary' | 'success' | 'cancel';
const variants: Variants[] = ['primary', 'success', 'cancel'];

describe('Button.cy.tsx', () => {
  variants.forEach(variant => {
    it(`Mounts button with class ${variant} and text ${variant}`, () => {
      cy.mount(<Button variant={variant}>{variant}</Button>)
      cy.get('button').should('have.class', variant)
      cy.get('button').should('have.text', variant)
    })
  });

  it('Button with no variant prop defaults to primary', () => {
    cy.mount(<Button>Primary</Button>)
    cy.get('button').should('have.class', 'primary')
    cy.get('button').should('have.text', 'Primary')
  })

  it('Disabled button has correct class and is disabled', () => {
    cy.mount(<Button disabled={true} variant='disabled'>Disabled</Button>)
    cy.get('button').should('have.class', 'disabled')
    cy.get('button').should('be.disabled')
  })

  it('Button with onClick prop calls function when clicked', () => {
    const onClick = cy.stub()
    cy.mount(<Button onClick={onClick}>Click me</Button>)
    cy.get('button').click().then(() => {expect(onClick).to.be.called})
  })
})