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
      credit_property.value = parseInt(Currency.toPennies($('input#item_credit', this).val()));
      cash_property.key = 'cash_price'
      cash_property.value = parseInt(Currency.toPennies($('input#item_cash', this).val()));
      
      line.item = item;
      line.sell = false;
      line.condition = 5;
      line.quantity = parseInt($('input#item_quantity', this).val());
      line.price = line.item.price * line.quantity;
      line.item.properties.push(credit_property);
      line.item.properties.push(cash_property);
      lines.push(line);
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