const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;

describe('Login', () => {
    it('should display the sign in form', () => {
        cy.visit('/login')
            .get('h1').contains('Login')
            .get('form')
    });
    it('should allow a user to sign in', () => {
        // register user
        cy.visit('/register')
            .get('input[name="username"]').type(username)
            .get('input[name="email"]').type(email)
            .get('input[name="password"]').type('text')
            .get('input[type="submit"]').click();
        // log a user out
        cy.get('.navbar-burger').click();
        cy.contains('Log Out').click();
        //log a user in
        cy.get('a').contains('Log In').click()
            .get('input[name="email"]').type(email)
            .get('input[name="password"]').type('text')
            .get('input[type="submit"]').click()
            .wait(100);
        cy.contains('All Users');
        cy.get('table')
            .find('tbody > tr').last()
            .find('td').contains(username);
        // cy.get('.navbar-burger').click();
        cy.get('.navbar-menu').within(() => {
            cy.get('.navbar-item').contains('User Status')
            cy.get('.navbar-item').contains('Log Out')
            cy.get('.navbar-item').contains('Log In').should('not.be.visible')
            cy.get('.navbar-item').contains('Register').should('not.be.visible');
        });
        // log a user out
        cy.get('a').contains('Log Out').click();
        cy.get('p').contains('You are now logged out');
        cy.get('.navbar-menu').within(() => {
            cy.get('.navbar-item').contains('User Status').should('not.be.visible')
            cy.get('.navbar-item').contains('Log Out').should('not.be.visible')
            cy.get('.navbar-item').contains('Log In')
            cy.get('.navbar-item').contains('Register');
        });
    });
});