describe('Dashboard', () => {
    beforeEach(() => {
        // cy.login(); // Fungsi custom untuk login, bisa Anda tambahkan di commands.js
        // cy.visit('/dashboard');
        cy.login('081234567890', 'password')
    });

    // login as admin
    it('dashboard admin', () => {        
        cy.url().should('include', '/dashboard'); 
        cy.contains('Hi admin').should('exist')

        // check dashboard penghuni not broke
        cy.get('a[href="/dashboard/penghuni"]').not('.hidden')
        .first().click();
        cy.contains('Data-verif').should('exist')

        // check dashboard penghuni not broke
        cy.get('a[href="/dashboard/penghuni/data-penghuni"]').not('.hidden')
        .first().click();
        cy.contains('Data-penghuni').should('exist')
    });

    
});
