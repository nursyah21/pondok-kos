describe('Dashboard', () => {
    beforeEach(() => {
        // cy.login(); // Fungsi custom untuk login, bisa Anda tambahkan di commands.js
        // cy.visit('/dashboard');
    });

    // login as admin
    it('dashboard admin', () => {
        cy.login('081234567890', 'password')
        cy.url().should('include', '/dashboard'); 
    });
});
