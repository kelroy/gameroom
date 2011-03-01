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
    id = $('div#till select#till_id').val();
    title = $('div#till select#till_id option:selected').html();
    event.data.instance.notifyObservers(new Till(id, title));
    event.preventDefault();
  }
});

var CustomerController = new JS.Class(ViewController, {

  reset: function() {

  }
});

var CartController = new JS.Class(ViewController, {

  reset: function() {

  }
});

var PaymentController = new JS.Class(ViewController, {

  reset: function() {

  }
});

var ReviewController = new JS.Class(ViewController, {

  reset: function() {

  }
});
var PageController = new JS.Class(ViewController, {

  sections: [],

  initialize: function(view, sections) {
    $('a', view).bind('click', {page_controller: this, view: view}, this.doClick);
    this.sections = sections;
    this.callSuper();
  },

  doClick: function(event) {
    index = $('li > a', event.data.view).index(this);
    event.data.page_controller.showSection(index);
    event.preventDefault();
  },

  showSection: function(index) {
    this.hideSections();
    this.sections[index].show();
    $('li a', this.view).removeClass('selected');
    $('li a', this.view).eq(index).addClass('selected');
  },

  hideSections: function() {
    for(section in this.sections) {
      $(this.sections[section]).hide();
    }
  },

  reset: function() {
    $('li a', this.view).removeClass('selected');
    $('li a', this.view).first().addClass('selected');
	this.sections[0].show();
    this.view.show();
  }
});
var SummaryController = new JS.Class(ViewController, {

  reset: function() {
    this.setCustomer('Select a customer...');
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    this.setTotal(transaction.total);
  },

  setItemCount: function(count) {
    $('h2#summary_item_count', this.view).html(count + ' item(s)');
  },

  setCustomer: function(customer) {
    $('h2#summary_customer', this.view).html(customer);
  },

  setTotal: function(total) {
    $('h2#summary_total', this.view).html(Currency.pretty(total));
  }
});
var Till = new JS.Class({

  initialize: function(id, title) {
    this.id = id;
    this.title = title;
  }
});
var Currency = new JS.Class({
  extend: {
    pretty: function(pennies) {
      value = pennies / 100;
      return '$' + value.toFixed(2);
    }
  }
});

var TransactionController = new JS.Class({

  transactions: [],

  initialize: function() {

    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.till = new Till();

    this.section_controller = new PageController('ul#section_nav', [
      this.customer_controller.view,
      this.cart_controller.view,
      this.payment_controller.view,
      this.review_controller.view
    ]);
    this.summary_controller = new SummaryController('ul#summary');
    this.transaction_nav = $('ul#transaction_nav').hide();
    $('ul#finish').hide();
  },

  reset: function() {
    this.customer_controller.reset();
    this.cart_controller.reset();
    this.payment_controller.reset();
    this.review_controller.reset();
    this.section_controller.reset();
    this.summary_controller.reset();
  },

  addTransaction: function(till) {
    this.reset();
    transaction = new Transaction();
    transaction.addObserver(this.summary_controller.update, this.summary_controller);
    this.transactions.push(transaction);
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
    this.transaction_controller.addTransaction(till);
    $('li.current_user_till', this.user_nav).html(till.title);
    $(this.user_nav).show();
    this.till_controller.view.hide();
  }
});

var gameroomlincoln_terminal = {

  run: function() {

    new TerminalController();

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
var Transaction = new JS.Class({
  include: JS.Observable,

  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.items = [];
    this.total = 0;
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },

  updated: function() {
    this.notifyObservers(this);
  },

  save: function() {

  }
});
