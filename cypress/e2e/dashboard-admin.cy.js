describe('Dashboard', () => {
    beforeEach(() => {
        // cy.login(); // Fungsi custom untuk login, bisa Anda tambahkan di commands.js
        // cy.visit('/dashboard');
        cy.viewport(1366,768)
        cy.login('081234567890', 'password')
    });

    // login as admin
    it('check all route', () => {        
        cy.url().should('include', '/dashboard') 
        
        cy.contains('Hi admin').should('be.visible')

        // check riwayat transaksi
        cy.get('a[href="/dashboard/riwayat-transaksi"]').click()
        cy.url().should('include', '/dashboard/riwayat-transaksi') 
        
        cy.contains('Riwayat-transaksi').should('be.visible')

        // check penghuni
        cy.get('a[href="/dashboard/penghuni"]').click()
        cy.url().should('include', '/dashboard/penghuni') 

        cy.contains('Penghuni').should('be.visible')
        
        // check verifikasi penghuni
        cy.get('a[href="/dashboard/verifikasi-penghuni"]').click()
        cy.url().should('include', '/dashboard/verifikasi-penghuni') 

        cy.contains('Verifikasi-penghuni').should('be.visible')

        // check penjaga 
        cy.get('a[href="/dashboard/penjaga"]').click()
        cy.url().should('include', '/dashboard/penjaga') 

        cy.contains('Penjaga').should('be.visible')

        // check manajemen user 
        cy.get('a[href="/dashboard/manajemen-user"]').click()
        cy.url().should('include', '/dashboard/manajemen-user') 

        cy.contains('Manajemen-user').should('be.visible')

        // check unit kos
        cy.get('a[href="/dashboard/unit-kos"]').click()
        cy.url().should('include', '/dashboard/unit-kos') 

        cy.contains('Unit-kos').should('be.visible')

        // check kamar kos
        cy.get('a[href="/dashboard/kamar-kos"]').click()
        cy.url().should('include', '/dashboard/kamar-kos') 

        cy.contains('Kamar-kos').should('be.visible')

        // check edit profile
        cy.get('[data-cy=avatar]').click()
        cy.contains('Edit Profile').should('be.visible')

        cy.get('.edit-profile').click()
        cy.url().should('include', '/dashboard/edit-profile') 

        cy.contains('Edit-profile').should('be.visible')

        // check logout
        cy.get('[data-cy=avatar]').click()
        cy.contains('Keluar').should('be.visible')

        // cy.get('a[href="/dashboard/logout"]').click()
        cy.get('.keluar').click()
        cy.url().should('include', 'logout') 
    
        cy.contains('Logout').should('be.visible')

        cy.url().should('include', '/login') 
        cy.contains('Masuk').should('be.visible')

        // check dashboard penghuni not broke
        // cy.get('a[href="/dashboard/penghuni"]').not('.hidden')
        // .first().click();
        // cy.contains('Data-verif').should('exist')

        // check dashboard penghuni not broke
        // cy.get('a[href="/dashboard/penghuni/data-penghuni"]').not('.hidden')
        // .first().click();
        // cy.contains('Data-penghuni').should('exist')
    });

    
});
