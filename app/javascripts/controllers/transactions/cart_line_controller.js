//= require "../view_controller"

var CartLineController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view, index, line, open) {
    this.callSuper();
    this.line_index = index;
    this.line = line;
    this.open = open;
    this.set(this.line);
    $('a.remove', this.view).bind('click', {instance: this}, this.onRemove);
    $('a.info', this.view).bind('click', {instance: this}, this.onInfo);
    $('a.plus', this.view).bind('click', {instance: this}, this.onPlus);
    $('a.minus', this.view).bind('click', {instance: this}, this.onMinus);
    $('ul.cart_line_action li a', this.view).bind('click', {instance: this}, this.onAction);
    $('ul.cart_line_sell_condition li a', this.view).bind('click', {instance: this}, this.onCondition);
  },
  
  set: function(line) {
    $('input#quantity_amount', this.view).val(line.quantity);
    $('hgroup.cart_line_information h3', this.view).html(line.item.title);
    $('hgroup.cart_line_information h4', this.view).html(String.truncate(line.item.description, 50)).attr('title', line.item.description);
    $('h4.cart_line_subtotal', this.view).html(Currency.pretty(line.subtotal()));
    $('ul.cart_line_action li a', this.view).removeClass('selected');
    $('span.cart_line_credit_value', this.view).html('Credit Value: ' + Currency.pretty(line.item.creditPrice() * line.condition));
    $('span.cart_line_cash_value', this.view).html('Cash Value: ' + Currency.pretty(line.item.cashPrice() * line.condition));
    $('ul.cart_line_sell_condition li a', this.view).removeClass('selected');
    $('ul.cart_line_sell_condition li a', this.view).eq((line.condition * 5) - 1).addClass('selected');
    if(line.sell) {
      $('ul.cart_line_action li a.sell', this.view).addClass('selected');
      this.showControls();
    } else {
      $('ul.cart_line_action li a.purchase', this.view).addClass('selected');
      this.hideControls();
    }
    if(this.isOpen()) {
      $('div.cart_info', this.view).css('display', 'block');
    }
  },
  
  isOpen: function() {
    return this.open;
  },
  
  toggleInfo: function() {
    if(this.open) {
      this.open = false;
      $('div.cart_info', this.view).hide();
    } else {
      this.open = true;
      $('div.cart_info', this.view).show();
    }
  },
  
  setPurchase: function() {
    this.line.setPurchase();
    this.notifyObservers(this.line_index, this.line);
  },
  
  setSell: function() {
    this.line.setSell();
    this.notifyObservers(this.line_index, this.line);
  },
  
  onCondition: function(event) {
    index = $('ul.cart_line_sell_condition li a', event.data.instance.view).index(this);
    event.data.instance.line.setCondition($('ul.cart_line_sell_condition li a').eq(index).attr('data-condition') / 5);
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },
  
  onInfo: function(event) {
    $('div.cart_info', event.data.instance.view).toggle();
    event.data.instance.open = !event.data.instance.open;
    event.preventDefault();
  },
  
  onPlus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    event.data.instance.line.setQuantity(parseInt(quantity) + 1);
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },
  
  onMinus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    if(quantity > 1) {
      event.data.instance.line.setQuantity(parseInt(quantity) - 1);
      event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    }
    event.preventDefault();
  },
  
  onAction: function(event) {
    index = $('ul.cart_line_action li a', event.data.instance.view).index(this);
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
  
  showControls: function() {
    $('ul.cart_line_sell_control', this.view).css('display', 'block');
  },
  
  hideControls: function() {
    $('ul.cart_line_sell_control', this.view).hide();
  }
});