

describe('Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('should successfully register a new user', () => {
      cy.generateRandomUserData().then(user=>{
        cy.get('[data-cy=name]').type(user.name);
        cy.get('[data-cy=email]').type(user.phoneNumber);
        cy.get('[data-cy=password]').type('password');
        cy.get('[data-cy=password2]').type('password');
        cy.get('[data-cy=register-button]').click();
      })
      cy.url().should('include', '/login'); // atau '/dashboard' jika langsung login
    });
  });
  