//= require "../model"
//= require "property"
//= require "line"

var Item = new JS.Class(Model, {
  extend: {
    resource: 'item',
    columns: ['id', 'title', 'description', 'sku', 'price', 'credit', 'cash', 'taxable', 'discountable', 'locked', 'active'],
    has_many: ['properties']
  },
  
  valid: function() {
    return this.title != '' && this.price >= 0 && this.credit >= 0 && this.cash >= 0;
  }
});