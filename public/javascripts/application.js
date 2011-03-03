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
  include: JS.Observable,

  reset: function() {

  }
});

var CartController = new JS.Class(ViewController, {
  include: JS.Observable,

  reset: function() {

  }
});
var PaymentLineController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('input.payment', view).bind('change', {instance: this}, this.onChange);
    $('a.clear', view).bind('click', {instance: this}, this.onClear);
    this.payment = new Payment();
    this.payment.type = $('input.payment', view).attr('data-payment-type');
    this.disable();
    this.reset();
    this.callSuper();
    this.view.show();
  },

  reset: function() {
    $('input.payment', this.view).val(null);
  },

  enable: function() {
    $('input.payment', this.view).attr('disabled', false);
  },

  disable: function() {
    $('input.payment', this.view).attr('disabled', true);
  },

  hideClearButtons: function() {
    $('a.clear', this.view).hide();
  },

  showClearButtons: function() {
    $('a.clear', this.view).show();
  },

  onClear: function(event) {
    input = $(this).parents('div.payment_line').find('input.payment');
    input.val(null);
    event.data.instance.payment.amount = null;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.payment.amount = Currency.toPennies($(this).val());

      if(event.data.instance.payment.amount != 0) {
        $(this).val(Currency.format(event.data.instance.payment.amount));
      } else {
        $(this).val(null);
      }
      event.data.instance.notifyObservers(event.data.instance.payment);
    } else {
      $(this).val(null);
    }
  }
});
var StoreCreditController = new JS.Class(PaymentLineController, {

  initialize: function(view) {
    $('a.apply', view).hide().bind('click', {instance: this}, this.onApply);
    this.setTransaction(new Transaction());
    this.callSuper();
  },

  enable: function() {
    if(this.transaction.customer.id != null) {
      this.callSuper();
    }
  },

  onApply: function(event) {
    if(event.data.instance.transaction.customer.credit > event.data.instance.transaction.total) {
      amount = event.data.instance.transaction.total;
    } else {
      amount = event.data.instance.transaction.customer.credit;
    }
    $('div#payment_store_credit input#store_credit_amount').val(Currency.format(amount));
    event.data.instance.payment.amount = amount;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      amount = Currency.toPennies($(this).val());
      credit = event.data.instance.transaction.customer.credit;
      total = event.data.instance.transaction.total;

      if(amount > credit) {
        event.data.instance.payment.amount = credit;
      } else {
        event.data.instance.payment.amount = amount;
      }
      if(event.data.instance.payment.amount > total) {
        event.data.instance.payment.amount = total;
      }
      if(event.data.instance.payment.amount != 0) {
        $(this).val(Currency.format(event.data.instance.payment.amount));
      } else {
        $(this).val(null);
      }
      event.data.instance.notifyObservers(event.data.instance.payment);
    } else {
      $(this).val(null);
    }
  },

  setTransaction: function(transaction) {
    this.transaction = transaction;
    if(transaction.customer.id != null) {
      $('div#payment_store_credit span#payment_customer').html(transaction.customer.person.first_name + ' ' + transaction.customer.person.last_name + ': ' + Currency.pretty(transaction.customer.credit));
      $('div#payment_store_credit a.apply').show();
      this.enable();
    }
  }

});
var ScaleController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.setTransaction(new Transaction());
    this.callSuper();
  },

  reset: function() {
    $('input.scale', this.view).val(null);
  },

  enable: function() {
    this.view.show();
  },

  disable: function() {
    this.view.hide();
  },

  setTransaction: function(transaction) {
    this.transaction = transaction;
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(this.transaction.total)));
  }

});
var Till = new JS.Class({

  initialize: function(id, title) {
    this.id = id;
    this.title = title;
  }
});
var Person = new JS.Class({

  initialize: function() {
    this.first_name = null;
    this.middle_name = null;
    this.last_name = null;
    this.date_of_birth = null;
  },

  save: function() {

  }
});

var Customer = new JS.Class({

  initialize: function() {
    this.id = null;
    this.person = new Person();
    this.credit = null;
    this.drivers_license_number = null;
    this.drivers_license_state = null;
    this.notes = null;
    this.active = false;
  },

  save: function() {

  }
});
var Receipt = new JS.Class({

  initialize: function(quantity) {
    this.quantity = quantity;
  },
});
var Item = new JS.Class({

  initialize: function() {
    this.quantity = 3;
    this.title = 'blak';
    this.description = 'Lorem...';
    this.sku = '11121222';
    this.price = 1234;
  }
});
var Payment = new JS.Class({

  initialize: function() {
    this.type = 'cash';
    this.amount = 0;
  }
});

var Transaction = new JS.Class({
  include: JS.Observable,

  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.items = [];
    this.payments = [];
    this.subtotal = 0;
    this.total = -1000;
    this.tax = 0;
    this.change = 0;
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },

  updated: function() {
    this.notifyObservers(this);
  },

  updateCustomer: function(customer) {
    this.updated();
  },

  updateCart: function(cart) {
    this.updated();
  },

  updatePayment: function(payments) {
    this.payments = payments;
    this.updated();
  },

  updateReceipt: function(quantity) {
    this.receipt.quantity = quantity;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.transaction = new Transaction();
    this.scale_controller = new ScaleController('div#ul_payment_scale_container');
    this.store_credit_controller = new StoreCreditController('div#payment_store_credit');
    this.gift_card_controller = new PaymentLineController('div#payment_gift_card');
    this.check_controller = new PaymentLineController('div#payment_check');
    this.credit_card_controller = new PaymentLineController('div#payment_credit_card');
    this.cash_controller = new PaymentLineController('div#payment_cash');
    this.store_credit_controller.addObserver(this.setPayment, this);
    this.gift_card_controller.addObserver(this.setPayment, this);
    this.check_controller.addObserver(this.setPayment, this);
    this.credit_card_controller.addObserver(this.setPayment, this);
    this.cash_controller.addObserver(this.setPayment, this);
    this.payments = [];
    this.reset();
    this.callSuper();
  },

  reset: function() {
    this.payments = [];
    this.resetSummary();
    this.resetPaymentFields();
    this.resetScaleFields();
    this.enableBuyFromStore();
    this.notifyObservers(this.payments);
  },

  resetSummary: function() {
    $('div#payment_summary span#payment_summary_items', this.view).html('0 item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html('$0.00 ($0.00)');
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: $0.00');
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: $0.00');
    $('div#payment_action span#payment_change', this.view).html('Change Due: $0.00');
  },

  resetPaymentFields: function() {
    this.store_credit_controller.reset();
    this.gift_card_controller.reset();
    this.check_controller.reset();
    this.credit_card_controller.reset();
    this.cash_controller.reset();
  },

  resetScaleFields: function() {
    this.scale_controller.reset();
  },

  findPayment: function(type) {
    payment = null;
    for(p in this.payments) {
      if(this.payments[p].type == type) {
        payment = this.payments[p];
      }
    }
    return payment;
  },

  setPayment: function(payment) {
    existing_payment = this.findPayment(payment.type);
    if(existing_payment != null) {
      this.removePayment(existing_payment.type);
    }
    if(payment.amount != null && payment.amount != 0) {
      this.payments.push(payment);
    }
    this.notifyObservers(this.payments);
  },

  removePayment: function(type) {
    for(p in this.payments) {
      if(this.payments[p].type == type) {
        this.payments.splice(p, 1);
        return true;
      }
    }
    return false;
  },

  enablePaymentFields: function() {
    this.store_credit_controller.enable();
    this.gift_card_controller.enable();
    this.check_controller.enable();
    this.credit_card_controller.enable();
    this.cash_controller.enable();
  },

  disablePaymentFields: function() {
    this.store_credit_controller.disable();
    this.gift_card_controller.disable();
    this.check_controller.disable();
    this.credit_card_controller.disable();
    this.cash_controller.disable();
  },

  update: function(transaction) {
    this.transaction = transaction;
    this.store_credit_controller.setTransaction(transaction);
    this.scale_controller.setTransaction(transaction);
    this.updateSummary(transaction);
    if(transaction.total > 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },

  updateSummary: function(transaction) {
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.items.length + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total));
  },

  enableBuyFromStore: function() {
    this.enablePaymentFields();
    this.scale_controller.disable();
  },

  enableSellToStore: function() {
    this.disablePaymentFields();
    this.resetPaymentFields();
    this.payments = [];
    this.scale_controller.enable();
  }
});
var Currency = new JS.Class({
  extend: {
    pretty: function(pennies) {
      return '$' + Currency.format(pennies);
    },

    format: function(pennies) {
      value = pennies / 100;
      return value.toFixed(2);
    },

    toPennies: function(currency) {
      return currency * 100;
    }
  }
});
var String = new JS.Class({
  extend: {
    ucfirst: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    capitalize: function(string) {
      sentence = string.split(' ');
      for(word in sentence) {
        sentence[word] = String.ucfirst(sentence[word])
      }
      return sentence.join(' ');
    }
  }
});

var ReviewController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('input#receipt_quantity', view).bind('change', {instance: this}, this.onReceiptQuantityChanged);
    this.payment_row = $('div#review_summary table > tbody > tr#payment', view).detach();
    this.item_row = $('div#review_list table > tbody > tr', view).detach();
    this.reset();
    this.callSuper();
  },

  reset: function() {
    $('input#receipt_quantity', this.view).val(1);
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(0));
  },

  update: function(transaction) {
    alert(transaction.payments.length);
    $('div#review_summary table > tbody > tr#payment', this.view).remove()
    $('div#review_list table > tbody > tr', this.view).remove();

    for(item in transaction.items) {
      new_item_row = this.item_row.clone();
      $('td.quantity', new_item_row).html(transaction.items[item].quantity);
      $('td.title', new_item_row).html(transaction.items[item].title);
      $('td.description', new_item_row).html(transaction.items[item].description);
      $('td.sku', new_item_row).html(transaction.items[item].sku);
      $('td.price', new_item_row).html(Currency.pretty(transaction.items[item].price));
      $('td.subtotal', new_item_row).html(Currency.pretty(transaction.items[item].price * transaction.items[item].quantity));
      $('div#review_list table tbody').append(new_item_row);
    }
    for(payment in transaction.payments) {
      new_payment_row = this.payment_row.clone();
      $('td', new_payment_row).eq(0).html(String.capitalize(transaction.payments[payment].type.replace('_', ' ')));
      $('td', new_payment_row).eq(1).html(Currency.pretty(transaction.payments[payment].amount));
      $('div#review_summary table tbody tr#change').before(new_payment_row);
    }
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(transaction.subtotal));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(transaction.tax));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(transaction.total));
    $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(transaction.change));
  },

  onReceiptQuantityChanged: function(event) {
    quantity = $(this).val();
    if(!isNaN(quantity)) {
      event.data.instance.notifyObservers(quantity);
    } else {
      $(this).val(1);
      event.data.instance.notifyObservers(1);
    }
  },

  setReceiptQuantity: function(quantity) {
    this.notifyObservers(quantity);
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
    this.setCustomer(new Customer());
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    this.setCustomer(transaction.customer);
    this.setItemCount(transaction.items.length);
    this.setTotal(transaction.total);
  },

  setItemCount: function(count) {
    $('h2#summary_item_count', this.view).html(count + ' item(s)');
  },

  setCustomer: function(customer) {
    if(customer.id == null) {
      $('h2#summary_customer', this.view).html("Select a customer...");
    } else {
      $('h2#summary_customer', this.view).html(customer.person.first_name + ' ' + customer.person.last_name);
    }
  },

  setTotal: function(total) {
    $('h2#summary_total', this.view).html(Currency.pretty(total));
  }
});

var FinishController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('a', view).bind('click', {instance: this}, this.finish)
    this.callSuper();
  },

  finish: function(event) {
    event.data.instance.notifyObservers();
    event.preventDefault();
  },

  update: function(transaction) {
    if(transaction.valid()) {
      this.view.show();
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
    this.finish_controller = new FinishController('ul#finish');
    this.transaction_nav = $('ul#transaction_nav').hide();
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
    transaction.addObserver(this.payment_controller.update, this.payment_controller);
    transaction.addObserver(this.review_controller.update, this.review_controller);
    transaction.addObserver(this.summary_controller.update, this.summary_controller);
    transaction.addObserver(this.finish_controller.update, this.finish_controller);
    transaction.updated();
    this.customer_controller.addObserver(transaction.updateCustomer, transaction);
    this.cart_controller.addObserver(transaction.updateCart, transaction);
    this.payment_controller.addObserver(transaction.updatePayment, transaction);
    this.review_controller.addObserver(transaction.updateReceipt, transaction);
    this.finish_controller.addObserver(transaction.save, transaction);
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
var Entry = new JS.Class({

  initialize: function() {

  }
});
var Good = new JS.Class({

  initialize: function() {

  }
});
