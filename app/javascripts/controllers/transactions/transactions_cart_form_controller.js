//= require "../../sectionable"
//= require "../../models/line"
//= require "../../models/item"
//= require "../form_controller"

var TransactionsCartFormController = new JS.Class(FormController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.row = $('ul.transactions_line_elements', view).first().clone();
    
    $('input.price', this.view).bind('change', {instance: this}, this.onPrice);
    $('a.more', this.view).bind('click', {instance: this}, this.onMore);
    $('a.less', this.view).bind('click', {instance: this}, this.onLess);
    $('a.clear_all', this.view).live('click', {instance: this}, this.onClearAll);
    $('a.add_all', this.view).live('click', {instance: this}, this.onAddAll);
    $('a.clear_row', this.view).live('click', {instance: this}, this.onClearRow);
    $('a.add_row', this.view).live('click', {instance: this}, this.onAddRow);
  },
  
  saveAll: function() {
    var controller = this;
    $('ul.transactions_line_elements', this.view).each(function(index, value) {
      controller.saveLine(index);
    });
  },
  
  saveLine: function(index) {
    new_line = $('ul.transactions_line_elements', this.view).eq(index);
    
    base_price = parseInt(Currency.toPennies($('input#price', new_line).val()));
    if(base_price <= 0) {
      base_price = 0;
    }
    credit_price = parseInt(Currency.toPennies($('input#credit', new_line).val()));
    if(credit_price <= 0) {
      credit_price = 0;
    }
    cash_price = parseInt(Currency.toPennies($('input#cash', new_line).val()));
    if(cash_price <= 0) {
      cash_price = 0;
    }
    
    line = new Line({
      title: $('input#title', new_line).val(),
      description: $('input#description', new_line).val(),
      quantity: parseInt(Math.abs($('input#quantity', new_line).val())),
      condition: 1,
      discount: 1,
      price: base_price,
      credit: credit_price,
      cash: cash_price,
      purchase: true,
      taxable: $('input#taxable', new_line).attr('checked'),
      discountable: $('input#discountable', new_line).attr('checked')
    });
    
    if(this.valid([line])) {
      this.notifyObservers([line]);
    }
  },
  
  valid: function(lines) {
    for(l in lines) {
      if(lines[l].valid()) {
        if((lines[l].price > 0 || lines[l].credit > 0 || lines[l].cash > 0) && lines[l].quantity > 0) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }
    return false;
  },
  
  reset: function() {
    this.callSuper();
    $('input#quantity', this.view).val(1);
    $('input#taxable', this.view).attr('checked', true);
    $('input#discountable', this.view).attr('checked', true);
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
    $('ul.transactions_line_elements', event.data.instance.view).last().remove();
    event.preventDefault();
  },
  
  onAddAll: function(event) {
    event.data.instance.saveAll();
    event.preventDefault();
  },
  
  onClearAll: function(event) {
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
      .removeAttr('selected')
    $(this)
      .closest('ul')
      .find('input#quantity').val(1);
    $(this)
      .closest('ul')
      .find('input#taxable').attr('checked', true);
    $(this)
      .closest('ul')
      .find('input#discountable').attr('checked', true);
    event.preventDefault();
  },
  
  onAddRow: function(event) {
    event.data.instance.saveLine($('ul.transactions_line_elements li > a.add_row', event.data.instance.view).index(this));
    event.preventDefault();
  }
});