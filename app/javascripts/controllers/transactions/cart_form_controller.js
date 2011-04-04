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
    $('a.add_row', this.view).live('click', {instance: this}, this.onAddRow);
  },
  
  save: function() {
    lines = [];
    controller = this;
    $('ul.item_elements', this.view).each(function(index, value) {
      line = controller.saveLine(index);
      if(line != false) {
        lines.push(line);
      }
    });
    if(this.valid(lines)) {
      this.notifyObservers(lines);
    }
  },
  
  saveLine: function(index) {
    item = $('ul.item_elements', this.view).eq(index);
    
    base_price = parseInt(Currency.toPennies($('input#item_price', item).val()));
    if(base_price <= 0) {
      base_price = 0;
    }
    credit_price = parseInt(Currency.toPennies($('input#item_credit', item).val()));
    if(credit_price <= 0) {
      credit_price = 0;
    }
    cash_price = parseInt(Currency.toPennies($('input#item_cash', item).val()));
    if(cash_price <= 0) {
      cash_price = 0;
    }
    
    line = new Line({
      title: $('input#item_title', item).val(),
      quantity: parseInt(Math.abs($('input#item_quantity', item).val())),
      condition: 1,
      discount: 1,
      price: base_price,
      credit: credit_price,
      cash: cash_price,
      purchase: true,
      taxable: $('input#item_taxable', item).attr('checked'),
      discountable: $('input#item_discountable', item).attr('checked')
    });
    
    if(line.valid()) {
      return line;
    } else {
      return false;
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
    $('input#item_discountable', this.view).attr('checked', true);
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
  },
  
  onAddRow: function(event) {
    index = $('ul.item_elements li > a.add_row', event.data.instance.view).index(this);
    line = event.data.instance.saveLine(index);
    if(line != false) {
      event.data.instance.notifyObservers([line]);
    }
    event.preventDefault();
  }
});