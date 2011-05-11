//= require "../view_controller"

var TransactionsCartLineController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view, index, line, open) {
    this.callSuper();
    this.line_index = index;
    this.line = line;
    this.open = open;
    this.set(line);
    $('a.remove', this.view).bind('click', {instance: this}, this.onRemove);
    $('a.info', this.view).bind('click', {instance: this}, this.onInfo);
    $('a.plus', this.view).bind('click', {instance: this}, this.onPlus);
    $('a.minus', this.view).bind('click', {instance: this}, this.onMinus);
    $('ul.transactions_cart_line_action li a', this.view).bind('click', {instance: this}, this.onAction);
    $('ul.transactions_cart_line_sell_condition li a', this.view).bind('click', {instance: this}, this.onCondition);
    $('ul.transactions_cart_line_purchase_discount li a', this.view).bind('click', {instance: this}, this.onDiscount);
    $('form', this.view).bind('submit', {instance: this}, this.onSubmit);
  },
  
  set: function(line) {
    
    $('input.quantity', this.view).val(line.quantity);
    $('hgroup.transactions_cart_line_information h3.transactions_cart_line_title', this.view).html(line.title);
    if(line.description != undefined) {
      $('hgroup.transactions_cart_line_information h4.transactions_cart_line_description', this.view).html(line.description.truncate(50));
    }
    $('h4.transactions_cart_line_subtotal', this.view).html(Currency.pretty(line.subtotal()));
    $('ul.transactions_cart_line_action li a', this.view).removeClass('selected');
    $('span.transactions_cart_line_credit_value', this.view).html('Credit Value: ' + Currency.pretty(Math.round(line.credit * line.condition)));
    $('span.transactions_cart_line_cash_value', this.view).html('Cash Value: ' + Currency.pretty(Math.round(line.cash * line.condition)));
    $('ul.transactions_cart_line_sell_condition li a', this.view).removeClass('selected');
    $('ul.transactions_cart_line_sell_condition li a', this.view).eq(Math.round((line.condition * 5) - 1)).addClass('selected');
    $('ul.transactions_cart_line_purchase_discount li a', this.view).removeClass('selected');
    $('ul.transactions_cart_line_purchase_discount li a', this.view).eq(Math.round(((1 - line.discount) * 100) / 5)).addClass('selected');
    if(line.purchase) {
      $('ul.transactions_cart_line_action li a.purchase', this.view).addClass('selected');
      if(line.discountable) {
        this.showPurchaseControls();
      }
      this.hideSellControls();
    } else {
      $('ul.transactions_cart_line_action li a.sell', this.view).addClass('selected');
      this.showSellControls();
      this.hidePurchaseControls();
    }
    if(this.isOpen()) {
      $('div.transactions_cart_info', this.view).css('display', 'block');
    }
  },
  
  isOpen: function() {
    return this.open;
  },
  
  toggleInfo: function() {
    if(this.open) {
      this.open = false;
      $('div.transactions_cart_info', this.view).hide();
    } else {
      this.open = true;
      $('div.transactions_cart_info', this.view).show();
    }
  },
  
  setPurchase: function() {
    this.line.purchase = true;
    this.notifyObservers(this.line_index, this.line);
  },
  
  setSell: function() {
    this.line.purchase = false;
    this.notifyObservers(this.line_index, this.line);
  },
  
  onDiscount: function(event) {
    index = $('ul.transactions_cart_line_purchase_discount li a', event.data.instance.view).index(this);
    event.data.instance.line.discount = (1 - ($('ul.transactions_cart_line_purchase_discount li a').eq(index).attr('data-discount') / 100));
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },
  
  onCondition: function(event) {
    index = $('ul.transactions_cart_line_sell_condition li a', event.data.instance.view).index(this);
    event.data.instance.line.condition = ($('ul.transactions_cart_line_sell_condition li a').eq(index).attr('data-condition') / 5);
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },
  
  onInfo: function(event) {
    $('div.transactions_cart_info', event.data.instance.view).toggle();
    event.data.instance.open = !event.data.instance.open;
    event.preventDefault();
  },
  
  onPlus: function(event) {
    quantity = $('input.quantity', event.data.instance.view).val();
    event.data.instance.line.quantity = parseInt(quantity) + 1;
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },
  
  onMinus: function(event) {
    quantity = $('input.quantity', event.data.instance.view).val();
    if(quantity > 1) {
      event.data.instance.line.quantity = parseInt(quantity) - 1;
      event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    }
    event.preventDefault();
  },
  
  onSubmit: function(event) {
    quantity = $('input.quantity', event.data.instance.view).val();
    if(quantity >= 1) {
      event.data.instance.line.quantity = parseInt(quantity);
      event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    } else {
      $('input.quantity', event.data.instance.view).val(1);
    }  
    event.preventDefault();
  },
  
  onAction: function(event) {
    index = $('ul.transactions_cart_line_action li a', event.data.instance.view).index(this);
    if(index == 0) {
      event.data.instance.setPurchase();
    } else {
      event.data.instance.setSell();
    }
    event.preventDefault();
  },
  
  onRemove: function(event) {
    event.data.instance.line.quantity = 0;
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },
  
  showSellControls: function() {
    $('ul.transactions_cart_line_sell_control', this.view).css('display', 'block');
  },
  
  hideSellControls: function() {
    $('ul.transactions_cart_line_sell_control', this.view).hide();
  },
  
  showPurchaseControls: function() {
    $('ul.transactions_cart_line_purchase_control', this.view).css('display', 'block');
  },
  
  hidePurchaseControls: function() {
    $('ul.transactions_cart_line_purchase_control', this.view).hide();
  }
});