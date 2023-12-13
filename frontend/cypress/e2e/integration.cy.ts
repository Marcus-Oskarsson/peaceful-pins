describe('Integration with server', function () {
  this.beforeEach(() => {
    cy.visit("http://localhost:5173")
    cy.request('POST', '/api/reset') // reset database
  })

  describe('Register a new user', function() {
    it('registers a new user and recieves created user from server and sets jwt', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "test@test.test",
        password: "test"
      };
      cy.request('POST', '/api/register', {user: USER}).then((res) => {
        expect(res.body).contain({success: true})
        expect(res.status).to.equal(201)
        expect(res.body.data).to.have.property('user')
        cy.getCookie('token').should('exist')
      })
    })
    it('tries to register a user with an email that already exists', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "already.exist@mail.com",
        password: "test"
      };
      cy.request('POST', '/api/register', {user: USER}).then((res) => {
        expect(res.body).contain({success: false})
        expect(res.status).to.equal(409)
        expect(res.body.error).to.equal('Email already exists')
      })
    })
    it('tries to register a user with an invalid email', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "invalid.email",
        password: "test"
      };
      cy.request('POST', '/api/register', {user: USER}).then((res) => {
        expect(res.body).contain({success: false})
        expect(res.status).to.equal(400)
        expect(res.body.error).to.equal('Invalid email')
      })
    })
    it('Tries to register a user without a password', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "test@test.test",
        password: ""
      };
      cy.request('POST', '/api/register', {user: USER}).then((res) => {
        expect(res.body).contain({success: false})
        expect(res.status).to.equal(400)
        expect(res.body.error).to.equal('Passwords has to be at least 12 characters long')
      })
    })
  })

  describe('Login a user', function() {
    it('logs in a test user and recieves user from server and sets jwt as cookie', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "already.exist@mail.com",
        password: "test"
      };
      cy.request('POST', '/api/login', {user: USER}).then((res) => {
        expect(res.body).contain({success: true})
        expect(res.status).to.equal(200)
        expect(res.body.data).to.have.property('user')
        cy.getCookie('token').should('exist')
      })
    })
    it('tries to login a user with an email that does not exist', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "doesnt.exist@mail.com",
        password: "test"
      };
      cy.request('POST', '/api/login', {user: USER}).then((res) => {
        expect(res.body).contain({success: false})
        expect(res.status).to.equal(401)
        expect(res.body.error).to.equal('Username or password is incorrect')
      })
    })
    it('tries to login a user with an invalid password', () => {
      const USER = {
        firstname: "Test",
        lastname: "Testsson",
        email: "already.exist@mail.com",
        password: "invalid"
      };
      cy.request('POST', '/api/login', {user: USER}).then((res) => {
        expect(res.body).contain({success: false})
        expect(res.status).to.equal(401)
        expect(res.body.error).to.equal('Username or password is incorrect')
      })
    })
  })
})