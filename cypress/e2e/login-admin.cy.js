describe('Login as admin', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should return to dashboard', () => {        
        cy.get('[data-cy=email]').type('081234567890');
        cy.get('[data-cy=password]').type('password');
        cy.get('[data-cy=login-button]').click();
        cy.url().should('include', '/dashboard');
    });

    // it('should display an error message for invalid credentials', () => {
    //     // ... (masukkan kredensial yang salah)
    //     cy.get('[data-cy=error-message]').should('be.visible');
    // });
});
