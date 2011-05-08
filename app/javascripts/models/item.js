//= require "../model"
//= require "line"

var Item = new JS.Class(Model, {
  extend: {
    resource: 'item',
    columns: ['id', 'title', 'description', 'tags', 'sku', 'price', 'credit', 'cash', 'taxable', 'discountable', 'locked', 'active'],
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