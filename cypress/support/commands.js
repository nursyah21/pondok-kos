// ***********************************************
// This example commands.js shows you how to
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

const { faker } = require('@faker-js/faker')

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/login'); // Adjust the URL to your login page
    cy.get('[data-cy=email]').type(username);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=login-button]').click();
    // cy.session([username, password], () => { // Use cy.session for faster logins
    // });
});

Cypress.Commands.add('generateRandomUserData', () => {
    const phoneNumber = faker.phone.number('081########'); // Format for Indonesian phone numbers
    const name = faker.person.fullName();
    return { name, phoneNumber };
});