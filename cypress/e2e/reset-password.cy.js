describe('Reset Password', () => {
    it('should successfully send link reset password', () => {
        cy.visit('/reset-password');
        cy.get('[data-cy=email]').type('089529456271');
        cy.get('[data-cy=reset-button]').click();
        
    });
});
