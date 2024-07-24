

  /* ==== Test Created with Cypress Studio ==== */
  it('user.cy.js', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200');
    cy.get('.opacity-100 > .bg-opacity-60 > .inline-flex > .relative').click();
    cy.get('.left-0.w-1\\/2 > .space-y-4 > [type="email"]').clear('rightmencustomz@gmail.com');
    cy.get('.left-0.w-1\\/2 > .space-y-4 > [type="email"]').type('rightmencustomz@gmail.com');
    cy.get('.space-y-4 > .mb-6').clear('12');
    cy.get('.space-y-4 > .mb-6').type('12345678{enter}');
    cy.get('.left-0.w-1\\/2 > .space-y-4 > .py-2').click();
    cy.get('.space-x-6 > :nth-child(2) > .text-white').click();
    cy.get('.md\\:mr-8 > .inline-flex > .relative').click();
    cy.get('.space-x-6 > :nth-child(3)').click();
    cy.get('.space-x-6 > :nth-child(3) > .text-white').click();
    cy.get(':nth-child(1) > .p-3 > .flex-col > .items-center > .h-4').click();
    cy.get(':nth-child(1) > .p-3 > .flex-col > .justify-between > .bg-black').click();
    cy.get('.mt-4 > .bg-black').click();
    cy.get(':nth-child(2) > .w-full').clear('J');
    cy.get(':nth-child(2) > .w-full').type('John');
    cy.get(':nth-child(3) > .w-full').clear();
    cy.get(':nth-child(3) > .w-full').type('Doe');
    cy.get('.flex > div > .bg-black').click();
    cy.get('.mb-4.ng-untouched > :nth-child(1) > .w-full').select('Regular');
    cy.get('.mb-4.ng-untouched > :nth-child(2) > .w-full').click();
    cy.get('.mb-4.ng-invalid > :nth-child(2) > .w-full').clear();
    cy.get('.mb-4.ng-invalid > :nth-child(2) > .w-full').type('Jane');
    cy.get('[ng-reflect-name="1"] > :nth-child(3) > .w-full').clear();
    cy.get('[ng-reflect-name="1"] > :nth-child(3) > .w-full').type('Doe');
    cy.get('.mt-10 > .w-full').clear();
    cy.get('.mt-10 > .w-full').type('+25412345678');
    cy.get('.grid > :nth-child(2) > .bg-black').click();
    cy.get('.space-x-6 > :nth-child(1) > .text-white').click();
    cy.get('.container > .inline-flex > .relative').click();
    cy.get(':nth-child(2) > .p-3').click();
    cy.get(':nth-child(2) > .p-3 > .flex-col > .justify-between > .bg-black').click();
    cy.get('.space-x-6 > :nth-child(1) > .text-white').click();
    cy.get('.space-x-6 > :nth-child(5) > .text-white').click();
    cy.get(':nth-child(6) > .text-white').click();
    cy.get(':nth-child(1) > :nth-child(7) > .bg-blue-800').click();
    cy.get(':nth-child(1) > :nth-child(7) > .bg-red-600').click();
    cy.get('.bg-gray-600').click();
    cy.get(':nth-child(2) > :nth-child(7) > .bg-red-600').click();
    cy.get('.bg-gray-600').click();
    cy.get('.h-6').click();
    cy.get('[routerlink="/profile"]').click();
    cy.get('#phoneNumber').clear('+254122272253');
    cy.get('#phoneNumber').type('+25412272253');
    cy.get('form.ng-untouched > .bg-black').click();
    cy.get('[routerlink="/profile"]').click();
    cy.get('.mb-4.text-center > .bg-black').click();
    cy.get('[routerlink="/change-password"]').click();
    cy.get('form.ng-untouched > :nth-child(1)').click();
    cy.get('#oldPassword').clear('12');
    cy.get('#oldPassword').type('12345678');
    cy.get('#newPassword').clear('8');
    cy.get('#newPassword').type('87654321');
    cy.get('#confirmPassword').clear('8');
    cy.get('#confirmPassword').type('87654321{enter}');
    cy.get('form.ng-dirty > .bg-black').click();
    /* ==== End Cypress Studio ==== */
  });
