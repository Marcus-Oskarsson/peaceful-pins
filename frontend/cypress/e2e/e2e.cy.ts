describe("Home page", function () {
  this.beforeEach(() => {
    cy.visit("http://localhost:5173")
  })

  // Använd mocking för ett GET-anrop mot ditt backend gör något test kring informationen som renderas. Lägg in minst en JSON-fil i cypress/fixtures och använd denna istället för att lägga in ett body-värde i cy.intercept-anropet.
  it('fetch lists and its name is rendered on page', () => {
    cy.intercept('GET', '/api/lists/1', {fixture: 'list'}).as('getLists')
    cy.wait('@getLists');
    cy.get('.hejsan > div').contains('Min testlista')
  })
  
  // Skriv minst ett E2E-test som använder it. & Skriv minst ett “komplett” E2E-test som involverar frontend, backend och databas (och på så sätt är “end-to-end”). Testet ska kommunicera med frontend-delen, som i sin tur (via ett webbanrop) kommunicerar med backend-delen, som i sin tur kommunicerar med databasen. Använd inte mocking för detta. 
  it('posts new list and checks correct data is sent to server and server responds with correct data', () => {
    const NAME = 'testnamn';
    cy.intercept('POST', '/api/lists/2').as('postLists')
    
    cy.get('[data-test="id"]').type('2') // user id
    cy.get('[data-test="name"]').type(NAME) // todolist title
    cy.get('button').click(); // post new todolist

    cy.wait('@postLists');
    cy.get('@postLists').its('request.body').should('deep.equal', {todolisttitle: NAME, userId: 2})
    cy.get('@postLists').then((res) => {
      cy.wrap(res.response.body.data.filter((list) => list.todolisttitle === NAME)).should('have.length.at.least', 1)
    })
  })
})