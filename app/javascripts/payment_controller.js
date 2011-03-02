//= require "view_controller"
//= require "transaction"
//= require "customer"

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,
  payments: [],
  
  initialize: function(view) {
    this.transaction = new Transaction();
    this.customer = new Customer();
    $('input.payment', view).bind('change', {instance: this}, this.onPayment);
    $('a.clear', view).bind('click', {instance: this}, this.onClear);
    $('a.apply', view).hide().bind('click', {instance: this}, this.onApply);
    this.reset();
    this.callSuper();
  },
  
  onClear: function(event) {
    $(this).parents('div.payment_line').find('input').val(null);
    event.data.instance.notifyObservers(event.data.instance.payments);
    event.preventDefault();
  },
  
  onApply: function(event) {
    if(event.data.instance.customer.credit > event.data.instance.transaction.total) {
      amount = event.data.instance.transaction.total;
    } else {
      amount = event.data.instance.customer.credit;
    }
    $('div#payment_store_credit input#store_credit_amount').val(Currency.format(amount));
    event.data.instance.notifyObservers(event.data.instance.payments);
    event.preventDefault();
  },
  
  onPayment: function(event) {
    if(!isNaN($(this).val())) {
      // Check if payment type already exists
      // Check if value is 0
      payment = new Payment();
      payment.type = $(this).attr('data-payment-type');
      payment.amount = Currency.toPennies($(this).val());
      $(this).val(Currency.format(payment.amount));
      event.data.instance.payments.push(payment);
      event.data.instance.notifyObservers(event.data.instance.payments);
    } else {
      $(this).val(null);
    }
  },
  
  reset: function() {
    this.resetSummary();
    this.resetAllPaymentFields();
    this.resetAllScaleFields();
    this.enableBuyFromStore();
  },
  
  resetSummary: function() {
    $('div#payment_summary span#payment_summary_items', this.view).html('0 item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html('$0.00 ($0.00)');
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: $0.00');
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: $0.00');
    $('div#payment_action span#payment_change', this.view).html('Change Due: $0.00');
  },
  
  resetAllPaymentFields: function() {
    $('input.payment', this.view).val(null);
  },
  
  resetAllScaleFields: function() {
    $('input.scale', this.view).val(null);
  },
  
  update: function(transaction) {
    this.transaction = transaction;
    this.updateCustomer(transaction.customer);
    this.updateSummary(transaction);
    if(transaction.total >= 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },
  
  updateCustomer: function(customer) {
    if(customer.id != null) {
      this.customer = customer;
      $('div#payment_store_credit span#payment_customer').html(customer.person.first_name + ' ' + customer.person.last_name + ': ' + Currency.pretty(customer.credit));
      $('div#payment_store_credit a.apply').show();
    }
  },
  
  updateSummary: function(transaction) {
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.items.length + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total));
  },
  
  hideClearButtons: function() {
    $('a.clear', this.view).hide();
  },
  
  showClearButtons: function() {
    $('a.clear', this.view).show();
  },
  
  enableBuyFromStore: function() {
    this.showClearButtons();
    $('input.payment', this.view).attr('disabled', false);
    $('div#payment_action ul#payment_scale_container', this.view).hide();
  },
  
  enableSellToStore: function() {
    this.hideClearButtons();
    $('input.payment', this.view).attr('disabled', true);
    $('div#payment_action ul#payment_scale_container', this.view).show();
  }
});