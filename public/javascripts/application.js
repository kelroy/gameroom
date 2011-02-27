/* Gameroom Terminal */

var gameroomlincoln_terminal = {

  run: function() {

    gameroomlincoln_terminal.init();
    gameroomlincoln_terminal.showSection('customer');


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
var CartController = new JS.Class(SectionController, {

});
var Customer = new JS.Class({

  initialize: function() {

  },

  save: function() {

  }
});
var CustomerController = new JS.Class(SectionController, {

});
var Entry = new JS.Class({

  initialize: function() {

  }
});
var Good = new JS.Class({

  initialize: function() {

  }
});
var Item = new JS.Class({

  initialize: function() {

  }
});
var PaymentController = new JS.Class(SectionController, {

});
var Receipt = new JS.Class({

  initialize: function(quantity) {
    this.quantity = quantity;
  },
});
var ReviewController = new JS.Class(SectionController, {

});
var SectionController = new JS.Class({

  initialize: function(view) {
    this.view = $(view);
    this.view.hide();
  }
});
var TabController = new JS.Class({

  initialize: function() {


  }
});
var TerminalController = new JS.Class({

  initialize: function() {


  }
});
var Till = new JS.Class({

  initialize: function() {

  }
});
var TillController = new JS.Class({

  initialize: function() {

  }
});
var Transaction = new JS.Class({

  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.items = [];
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },

  save: function() {

  }
});
