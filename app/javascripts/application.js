/* Gameroom Terminal */

//= require "terminal_controller"

var gameroomlincoln_terminal = {
  
  run: function() {
    
    gameroomlincoln_terminal.init();
    gameroomlincoln_terminal.showSection('customer');
    
    //new TerminalController();
    
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
    $(document).keypress(function(event){
      switch(event.keyCode) {
        case 37:
          gameroomlincoln_terminal.cycleSection('back');
          break;
        case 39:
          gameroomlincoln_terminal.cycleSection('forward');
          break;
        default:
          break;
      }
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
    $('div#customer_search ul.alphabet_nav a').click(function(event){
      $('input#customer_search').val($(this).html());
      event.preventDefault();
    });
    
    /* Cart Nav */
    $('a.cart_list').click(function(event){
      gameroomlincoln_terminal.showCartSection('cart_list');
      event.preventDefault();
    });
    $('a.cart_add').click(function(event){
      gameroomlincoln_terminal.showCartSection('cart_add');
      event.preventDefault();
    });
    $('a.cart_search_results').click(function(event){
      gameroomlincoln_terminal.showCartSection('cart_search_results');
      event.preventDefault();
    });
    $('div#cart_search ul.alphabet_nav a').click(function(event){
      $('input#cart_search').val($(this).html());
      event.preventDefault();
    });
  },
  
  showSection: function(section) {
    $('section').hide();
    $('section#' + section).show();
    $('ul#section_nav a').removeClass('selected');
    $('ul#section_nav a.' + section).addClass('selected');
  },
  
  cycleSection: function(direction) {
    $('section').hide();
    $('ul#section_nav a').removeClass('selected');
    
    switch(direction) {
      case 'back':
        $('ul.section_nav a').each(function(index) {
          if(index != 0) {
            //$('section#' + section).show();
          }
        });
        break;
      case 'forward':
        break;
      default:
        break;
    }
  },
  
  showCustomerSection: function(section) {
    $('div#customer_pages > div').hide();
    $('div#customer_pages > div#' + section).show();
    $('ul#customer_nav a').removeClass('selected');
    $('ul#customer_nav a.' + section).addClass('selected');
  },
  
  showCartSection: function(section) {
    $('div#cart_pages > div').hide();
    $('div#cart_pages > div#' + section).show();
    $('ul#cart_nav a').removeClass('selected');
    $('ul#cart_nav a.' + section).addClass('selected');
  }
  
};