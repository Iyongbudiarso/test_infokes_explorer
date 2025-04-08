// https://on.cypress.io/api

function loginFirst() {
  cy.visit('/')
  cy.get('.login-btn').click()
  cy.get('#email').type('admin@gmail.com')
  cy.get('#password').type('secret')
  cy.get('.btn-primary').click()
}

describe('My First Test', () => {
  it('not login user', () => {
    cy.visit('/')
    cy.contains('.user-email', 'Please login first')
  })

  it('login user', () => {
    loginFirst()
    cy.contains('.user-email', 'admin@gmail.com')
  })
})

describe('Folder', () => {
  // create folder name random
  const folderName = Math.random().toString(36).substring(2, 7)

  it('create folder on root folder', () => {
    loginFirst()

    cy.get('.new-folder-btn').click()
    cy.get('#folderName').type(folderName)
    cy.get('.btn-primary').click()
    cy.get('.item-name').should('contain', folderName)
  })

  it('delete folder', () => {
    loginFirst()

    cy.get('.item-name').contains(folderName).click()
    cy.contains('.folder-title', folderName)
    cy.get('.delete-btn').click()
    cy.get('.btn-danger').click()
    cy.contains('.folder-title', 'Root')
    cy.get('.item-name').should('not.contain', folderName)
  })
})
