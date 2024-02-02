var FirstName = "Maksim";
var LsastName = "Maksimov";
var Email = "mm721253347@gmail.com";
var Password = "123456";
var NewName = 'Avik';
var NewLastName = 'Avikov';
var NewPassword = "1234567";

function generateRandomNumber() { 
  var randomNumber = Math.floor(Math.random() * 100); 
  return randomNumber.toString(); 
}

var NewMEmail = generateRandomNumber() + "zafr@gmail.com";

function LogIn() {
  cy.get('.ico-login').click();
  cy.get('#Email').type(NewMEmail);
  cy.get('#Password').type(Password);
  cy.get('.button-1.login-button').click();
}

describe('Test web-shop', () => {
    beforeEach(() => {
      cy.visit('https://demowebshop.tricentis.com/');
    })

    it('Register, log out, log in', () => {

      cy.get('.ico-register').click();
      cy.get('#gender-male').click();
      cy.get('#FirstName').type(FirstName);
      cy.get('#LastName').type(LsastName);
      cy.get('#Email').type(NewMEmail);
    
      cy.get('#Password').type(Password);
      cy.get('#ConfirmPassword').type(Password);
    
      cy.get('#register-button').click();
      cy.get('.button-1.register-continue-button').click();
    
      cy.get('.ico-logout').click();

      LogIn()
    })

    it('Product card', () => {
      LogIn();
      cy.get('ul.top-menu a').first().click().then(($element) => {
          cy.get('.button-2.product-box-add-to-cart-button').eq(0).click();
          cy.wait(1000);
          cy.get('.button-2.product-box-add-to-cart-button').eq(2).click();
          cy.get('.ico-cart').first().click(); 
          cy.get('input[name="removefromcart"]').first().check().type('{enter}');
          cy.get('#termsofservice').check();
          cy.get('#checkout').click(); 
          cy.get('select#BillingNewAddress_CountryId').select(generateRandomNumber());
          cy.get('#BillingNewAddress_City').type(generateRandomNumber()); 
          cy.get('#BillingNewAddress_Address1').type(generateRandomNumber() + '.' + generateRandomNumber()); 
          cy.get('#BillingNewAddress_PhoneNumber').type(generateRandomNumber()); 
          cy.get('#BillingNewAddress_ZipPostalCode').type(generateRandomNumber()); 

          for (let i = 0; i < 5; i++) {
            cy.get('input[value="Continue"]').eq(i).click();
            cy.wait(1000);
          }
          cy.get('input[value="Confirm"]').click(); 
          cy.get('.button-2.order-completed-continue-button').click(); 
      })
    })         

    it('Add review', () => {
      LogIn();
      var Rating = 20;

      for (let i = 1; i < 6; i++) {
        console.log(`Stars: ${i}`);

        cy.get('.picture').eq(i - 1).click();
        cy.contains('Add your review').click();
        cy.get('#AddProductReview_Title').type(i);
        cy.get('#AddProductReview_ReviewText').type(i);
        cy.get(`#addproductrating_${i}`).click();
        cy.get('input[name="add-review"]').click();

        cy.get('.product-review-item')
        .last()
        .find('.review-title').should('contain', i);
  
        cy.get('.product-review-item')
        .last()
        .find('.review-text').should('contain', i);
  
        cy.get('.product-review-item')
        .last()
        .find('.user')
        .invoke('text')
        .should('contain', 'Maksim');
  
        cy.get('.product-review-item')
        .last()
        .find(`div[style="width: ${Rating}%"]`)
        .should('exist');

        var Rating = Rating + 20;

        cy.get('.header-logo').click();
      }
    })

    it('Search', () => {
      cy.get('.top-menu').contains('a', 'Apparel & Shoes').click();
      cy.get('#products-pagesize').select('12');
    
      const dictionary = {};
    
      cy.get('.product-grid')
        .find('.product-title')
        .each(($el, index, $list) => {
          const productName = $el.text().trim();
          dictionary[`product${index+1}`] = productName;
        })
        .then(() => {
          cy.get('.header-logo').click();
    
          for (const key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
              const value = dictionary[key];
    
              cy.get('#small-searchterms').type(value);
              cy.get('input[value="Search"]').click();
              cy.get('.product-title').should('contain', value);
              cy.get('.header-logo').click();
            }
          }
        });
    });

    it('Add Wishlist', () => {
      cy.get('.top-menu').contains('a', 'Digital downloads').click();

      const dictionary = {};
    
      cy.get('.product-grid')
        .find('.product-title')
        .each(($el, index, $list) => {
          const productName = $el.text().trim();
          dictionary[`product${index+1}`] = productName;
        })
        .then(() => {
          cy.get('.product-grid')
          .find('.item-box')
          .its('length')
          .then((count) => {
    
            for (let i = 0; i < count; i++) {
              cy.get('.product-grid')
              .find('.picture')
              .eq(i)
              .click();
    
              cy.get('input[value="Add to wishlist"]').click();
              cy.get('.top-menu').contains('a', 'Digital downloads').click();
            }
    
            cy.get('.header-links').contains('span', 'Wishlist').click();

            for (const key in dictionary) {
              if (dictionary.hasOwnProperty(key)) {
                const value = dictionary[key];
                cy.get('.product').contains('a', value).should('exist');
              }
            }
    
            for (let i = 0; i < count; i++) {
              cy.get('input[name="removefromcart"]').eq(i).check();
            }
    
            cy.get('input[name="updatecart"]').click();
    
          }); 

        });     
    });

    it('Edit profile', () => {
      LogIn();
      var EditMail = 'New' + generateRandomNumber() + "@gmail.com";
      cy.get('.header-links')
      .find('.account')
      .click();

      cy.get('#gender-female').click();
      cy.get('#FirstName').clear().type(NewName);
      cy.get('#LastName').clear().type(NewLastName);
      cy.get('#Email').clear().type(EditMail);
      cy.get('input[name="save-info-button"]').click();

      cy.get('.listbox').contains('a', 'Addresses').click();

      cy.get('input[value="Add new"]').click();
      cy.get('#Address_FirstName').type(NewName);
      cy.get('#Address_LastName').type(NewLastName);
      cy.get('#Address_Email').type(EditMail);
      cy.get('#Address_CountryId').select('Aruba')
      cy.get('#Address_City').type('Сity №' + generateRandomNumber());
      cy.get('#Address_Address1').type('Home №' + generateRandomNumber());
      cy.get('#Address_ZipPostalCode').type(generateRandomNumber());
      cy.get('#Address_PhoneNumber').type(generateRandomNumber());
      cy.get('input[value="Save"]').click();


      cy.get('.listbox').contains('a', 'Change password').click();
      cy.get('#OldPassword').type(Password);
      cy.get('#NewPassword').type(NewPassword);
      cy.get('#ConfirmNewPassword').type(NewPassword);
      cy.get('input[value="Change password"]').click();
    });  
});