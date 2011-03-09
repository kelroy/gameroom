//= require "form_controller"
//= require "../models/line"
//= require "../models/item"
//= require "../models/property"

var CartFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
    this.row = $('ul.item_elements', view).first().clone();
    
    $('a.more', this.view).bind('click', {instance: this}, this.onMore);
    $('a.less', this.view).bind('click', {instance: this}, this.onLess);
    $('input.price', this.view).bind('change', {instance: this}, this.onPrice);
  },
  
  save: function() {
    lines = [];
    $('ul.item_elements', this.view).each(function() {
      line = new Line();
      item = new Item();
      credit_property = new Property();
      cash_property = new Property();
      
      item.title = $('input#item_title', this).val();
      item.description = $('input#item_description', this).val();
      item.price = parseInt(Currency.toPennies($('input#item_price', this).val()));
      item.taxable = $('input#item_taxable', this).attr('checked');
      
      credit_property.key = 'credit_price';
      credit_price = parseInt(Currency.toPennies($('input#item_credit', this).val()));
      if(credit_price > 0) {
        credit_property.value = credit_price;
      } else {
        credit_property.value = 0;
      }
      cash_property.key = 'cash_price'
      cash_price = parseInt(Currency.toPennies($('input#item_cash', this).val()));
      if(cash_price > 0) {
        cash_property.value = cash_price;
      } else {
        cash_property.value = 0;
      }
      
      line.item = item;
      line.sell = false;
      line.condition = 5;
      line.quantity = parseInt(Math.abs($('input#item_quantity', this).val()));
      line.calculatePrice();
      line.item.properties.push(credit_property);
      line.item.properties.push(cash_property);
      if(line.valid()) {
        lines.push(line);
      }
    });
    if(this.valid(lines)) {
      this.notifyObservers(lines);
    }
  },
  
  valid: function(lines) {
    valid = false;
    for(line in lines) {
      valid = lines[line].valid();
    }
    return valid;
  },
  
  reset: function() {
    this.callSuper();
    $('input#item_taxable', this.view).attr('checked', true);
  },
  
  onPrice: function(event) {
    $(this).val(Currency.format(Currency.toPennies(Math.abs($(this).val()))));
  },
  
  onMore: function(event) {
    $('form', event.data.instance.view).append(event.data.instance.row.clone());
    event.preventDefault();
  },
  
  onLess: function(event) {
    $('ul.item_elements', event.data.instance.view).last().remove();
    event.preventDefault();
  },
  
  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});