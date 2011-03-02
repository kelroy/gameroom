//= require "view_controller"

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,
  payments: [],
  
  initialize: function(view) {
    //$('input#receipt_quantity', view).bind('change', {instance: this}, this.onReceiptQuantityChanged);
    $('a.clear', view).bind('click', this.onClear);
    $('a.apply', view).hide().bind('click', this.onApply);
    this.reset();
    this.callSuper();
  },
  
  onClear: function(event) {
    $(this).parents('div.payment_line').find('input').val(null);
    this.notifyObservers(this.payments);
    event.preventDefault();
  },
  
  onApply: function(event) {
    $('div#payment_store_credit input#store_credit_amount').val(this.transaction.customer.credit);
    this.notifyObservers(this.payments);
    event.preventDefault();
  },
  
  reset: function() {
    this.resetSummary();
    this.resetAllPaymentFields();
    this.resetAllScaleFields();
    this.showClearButtons();
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
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.items.length + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total));
    if(transaction.total >= 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },
  
  hideClearButtons: function() {
    $('a.clear', this.view).hide();
  },
  
  showClearButtons: function() {
    $('a.clear', this.view).show();
  },
  
  enableBuyFromStore: function() {
    this.resetAllPaymentFields();
    this.resetAllScaleFields();
    this.showClearButtons();
    $('input.payment', this.view).attr('disabled', false);
    $('div#payment_action ul#payment_scale_container', this.view).hide();
  },
  
  enableSellToStore: function() {
    this.resetAllPaymentFields();
    this.resetAllScaleFields();
    this.hideClearButtons();
    $('input.payment', this.view).attr('disabled', true);
    $('div#payment_action ul#payment_scale_container', this.view).show();
  }
});