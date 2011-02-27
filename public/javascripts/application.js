/* Gameroom Terminal */

var ViewController = new JS.Class({

  initialize: function(view) {
    this.view = $(view);
    this.view.hide();
  }
});

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);

    return this.callSuper();
  },

  doSelect: function(event) {
    event.data.instance.notifyObservers(new Till(0, 'Title'));
    event.preventDefault();
  }
});

var CustomerController = new JS.Class(ViewController, {

});

var CartController = new JS.Class(ViewController, {

});

var PaymentController = new JS.Class(ViewController, {

});

var ReviewController = new JS.Class(ViewController, {

});
var TabController = new JS.Class(ViewController, {

});
var TransactionController = new JS.Class({

  initialize: function() {

    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.till = new Till();

    this.section_nav = new TabController('ul#section_nav');
    this.summary_nav = $('ul#summary_nav').hide();
    this.transaction_nav = $('ul#transaction_nav').hide();
  },

  newTransaction: function() {
  }
});

var TerminalController = new JS.Class({

  initialize: function() {

    this.transaction_controller = new TransactionController();
    this.till_controller = new TillController('div#till');
    this.user_nav = $('ul#user_nav').hide();

    this.till_controller.view.show();
    this.till_controller.addObserver(this.updateTill, this);
  },

  updateTill: function(till) {
    this.transaction_controller.till = till;
    this.transaction_controller.newTransaction();
    $('li.current_user_till', this.user_nav).html(till.title);
    $(this.user_nav).show();
    this.till_controller.view.hide();
  }
});

var gameroomlincoln_terminal = {

  run: function() {


    new TerminalController();

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
var Customer = new JS.Class({

  initialize: function() {

  },

  save: function() {

  }
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
var Receipt = new JS.Class({

  initialize: function(quantity) {
    this.quantity = quantity;
  },
});
var Till = new JS.Class({

  initialize: function(id, title) {
    this.id = id;
    this.title = title;
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
