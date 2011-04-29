//= require "../model"
//= require "property"
//= require "line"

var Item = new JS.Class(Model, {
  extend: {
    resource: 'item',
    columns: ['id', 'title', 'description', 'tags', 'sku', 'price', 'credit', 'cash', 'taxable', 'discountable', 'locked', 'active'],
    has_many: ['properties'],
    validations: {
      'title': {
        'presence_of': {}
      },
      'sku': {
        'presence_of': {}
      }
    },
  }
});