/* Gameroom Terminal */

var gameroomlincoln_terminal = {
  
  run: function() {
    
    gameroomlincoln_terminal.init();
    
  },
  
  init: function() {
    
    /* Section Nav */
    $('a.customer').click(function(event){
      gameroomlincoln_terminal.showSection('customer');
      event.preventDefault();
    });
    $('a.cart').click(function(event){
      gameroomlincoln_terminal.showSection('cart');
      event.preventDefault();
    });
    $('a.payment').click(function(event){
      gameroomlincoln_terminal.showSection('payment');
      event.preventDefault();
    });
    $('a.review').click(function(event){
      gameroomlincoln_terminal.showSection('review');
      event.preventDefault();
    });
    
    /* Customer Nav */
    $('a.customer_form').click(function(event){
      gameroomlincoln_terminal.showCustomerSection('customer_form');
      event.preventDefault();
    });
    $('a.customer_search_results').click(function(event){
      gameroomlincoln_terminal.showCustomerSection('customer_search_results');
      event.preventDefault();
    });
  },
  
  showSection: function(section) {
    $('section').hide();
    $('section#' + section).show();
    $('ul#section_nav a').removeClass('active');
    $('ul#section_nav a.' + section).addClass('active');
  },
  
  showCustomerSection: function(section) {
    $('div#customer_page_container > div').hide();
    $('div#customer_page_container > div#' + section).show();
    $('ul#customer_nav a').removeClass('active');
    $('ul#customer_nav a.' + section).addClass('active');
  }
  
};