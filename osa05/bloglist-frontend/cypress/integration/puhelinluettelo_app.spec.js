describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      nimi: 'Matti Luukkainen',
      kayttajanimi: 'mluukkai',
      salasana: 'salainen'
    }
    const user2 = {
      nimi: 'Jussi Kajalin',
      kayttajanimi: 'jussik',
      salasana: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Username')
    cy.contains('Password')
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#usrn').type('mluukkai')
      cy.get('#pswd').type('salainen')
      cy.get('#login-btn').click()

      cy.contains('Matti Luukkainen is logged in')
    })

    it('fails with wrong credentials and shows red error message', function() {
      cy.get('#usrn').type('mluukkai')
      cy.get('#pswd').type('wrong')
      cy.get('#login-btn').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ kayttajanimi: 'mluukkai', salasana: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('Add new blog item').click()
      cy.get('#title-input').type('a blog created by cypress')
      cy.get('#author-input').type('Cypress')
      cy.get('#url-input').type('blog-created-by-cypress')
      cy.contains('Create').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'Another blog', author: 'JK', url: 'longlong-foo-foo-url1', likes: 0 })
        cy.createBlog({ title: 'second blog', author: 'JK', url: 'longlong-foo-foo-url2', likes: 2 })
        cy.createBlog({ title: 'third blog', author: 'JK', url: 'longlong-foo-foo-url3', likes: 3 })
      })

      it('one of those can be liked', function () {
        cy.contains('second blog').click()
        cy.contains('second blog').parent().contains('Like').click()
        cy.contains('second blog').parent().contains('Likes: 3')
      })
      it('blogs are in order by likes', function(){
        // initial order by likes
        cy.get('.blog:first').contains('third blog')
        cy.get('.blog:last').contains('Another blog')
        // cliking like buttons
        cy.contains('second blog').click() // Toggle
        cy.contains('second blog').parent().contains('Like').as('secondBtn')
        cy.get('@secondBtn').click() // Third like
        cy.get('@secondBtn').click() // Fourth like
        cy.contains('Another blog').click() // Toggle
        cy.contains('Another blog').parent().contains('Like').click() // First like
        // "second blog" appearing first and "Another blog" last is enought to prove that blogs are sorted by likes
        cy.get('.blog:first').contains('second blog').parent().contains('Likes: 4')
        cy.get('.blog:last').contains('Another blog').parent().contains('Likes: 1')
      })
    })
  })
  describe('Deleting blog', function () {
    beforeEach(function () {
      cy.login({ kayttajanimi: 'mluukkai', salasana: 'salainen' })
      cy.createBlog({ title: 'one to delete', author: 'Cypress: mluukkai', url: 'longlong-foo-foo-url1', likes: 0 })
    })

    it('Succeed with user that created blog item ', function () {
      cy.contains('one to delete').click()
      cy.contains('Delete').click()
    })

    it('Fails with wrong user', function () {
      cy.login({ kayttajanimi: 'jussik', salasana: 'salainen' })
      cy.createBlog({ title: 'second blog', author: 'JK', url: 'longlong-foo-foo-url2', likes: 2 })
      cy.contains('Jussi Kajalin is logged in')
      cy.contains('one to delete').click()
      cy.contains('one to delete').should('not.contain', 'Delete')
    })
  })
})