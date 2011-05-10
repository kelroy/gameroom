//= require "../model"

var Item = new JS.Class(Model, {
  extend: {
    resource: 'item',
    columns: ['id', 'title', 'description', 'image', 'tags', 'properties', 'sku', 'price', 'credit', 'cash', 'taxable', 'discountable', 'locked', 'active'],
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