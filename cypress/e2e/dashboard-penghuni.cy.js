describe('Dashboard', () => {
    beforeEach(() => {
        // cy.login(); // Fungsi custom untuk login, bisa Anda tambahkan di commands.js
        // cy.visit('/dashboard');
    });

    it('dashboard penghuni', () => {
        cy.login('081234567895', 'password')
        cy.url().should('include', '/dashboard'); 
    });
});
