//= require "view_controller"

var CartLineController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view, line, open) {
    this.callSuper();
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
    $('hgroup.cart_line_information h4', this.view).html(line.item.description);
    $('h4.cart_line_subtotal', this.view).html(Currency.pretty(line.calculatePrice()));
    $('ul.cart_line_action li a', this.view).removeClass('selected');
    for(property in line.item.properties) {
      switch(line.item.properties[property].key) {
        case 'credit_price':
          $('span.cart_line_credit_value', this.view).html('Credit Value: ' + Currency.pretty(line.item.properties[property].value * (line.condition / 5)));
          break;
        case 'cash_price':
          $('span.cart_line_cash_value', this.view).html('Cash Value: ' + Currency.pretty(line.item.properties[property].value * (line.condition / 5)));
          break;
        default:
          break;
      }
    }
    $('ul.cart_line_sell_condition li a', this.view).removeClass('selected');
    $('ul.cart_line_sell_condition li a', this.view).eq(line.condition - 1).addClass('selected');
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
  
  onCondition: function(event) {
    index = $('ul.cart_line_sell_condition li a', event.data.instance.view).index(this);
    event.data.instance.line.condition = parseInt($('ul.cart_line_sell_condition li a').eq(index).attr('data-condition'));
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },
  
  onInfo: function(event) {
    $('div.cart_info', event.data.instance.view).toggle();
    event.data.instance.open = !event.data.instance.open;
    event.preventDefault();
  },
  
  onPlus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    event.data.instance.line.quantity = parseInt(quantity) + 1;
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },
  
  onMinus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    if(quantity > 1) {
      event.data.instance.line.quantity = parseInt(quantity) - 1;
      event.data.instance.notifyObservers(event.data.instance.line);
    }
    event.preventDefault();
  },
  
  onAction: function(event) {
    index = $('ul.cart_line_action li a', event.data.instance.view).index(this);
    if(index == 0) {
      event.data.instance.line.sell = false;
    } else {
      event.data.instance.line.sell = true;
    }
    event.data.instance.line.calculatePrice();
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },
  
  onRemove: function(event) {
    event.data.instance.line.quantity = 0;
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },
  
  showControls: function() {
    $('ul.cart_line_sell_control', this.view).css('display', 'block');
  },
  
  hideControls: function() {
    $('ul.cart_line_sell_control', this.view).hide();
  }
});