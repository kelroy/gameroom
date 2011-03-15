//= require "../form_controller"
//= require "../../models/line"
//= require "../../models/item"
//= require "../../models/property"

var CartFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
    this.row = $('ul.item_elements', view).first().clone();
    
    $('a.more', this.view).bind('click', {instance: this}, this.onMore);
    $('a.less', this.view).bind('click', {instance: this}, this.onLess);
    $('input.price', this.view).bind('change', {instance: this}, this.onPrice);
    $('a.clear_row', this.view).live('click', {instance: this}, this.onClearRow);
  },
  
  save: function() {
    lines = [];
    $('ul.item_elements', this.view).each(function() {
      credit_price = parseInt(Currency.toPennies($('input#item_credit', this).val()));
      if(credit_price <= 0) {
        credit_price = 0;
      }

      cash_price = parseInt(Currency.toPennies($('input#item_cash', this).val()));
      if(cash_price <= 0) {
        cash_price = 0;
      }
      
      line = new Line({
        sell: false,
        condition: 5,
        quantity: parseInt(Math.abs($('input#item_quantity', this).val())),
        price: parseInt(Currency.toPennies($('input#item_price', this).val())),
        item: {
          title: $('input#item_title', this).val(),
          description: $('input#item_description', this).val(),
          price: parseInt(Currency.toPennies($('input#item_price', this).val())),
          taxable: $('input#item_taxable', this).attr('checked'),
          properties: [
            {
              key: 'credit_price',
              value: credit_price
            },
            {
              key: 'cash_price',
              value: cash_price
            }
          ]
        }
      });
      
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
    $('input#item_quantity', this.view).val(1);
    $('input#item_taxable', this.view).attr('checked', true);
  },
  
  onPrice: function(event) {
    value = $(this).val();
    if(isNaN(value)) {
      $(this).val(Currency.format(0));
    } else {
      $(this).val(Currency.format(Currency.toPennies(Math.abs(value))));
    }
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
  },
  
  onClearRow: function(event) {
    $(this)
      .closest('ul')
      .find(':input')
      .not(':button, :submit, :reset, :hidden')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
    event.preventDefault();
  }
});