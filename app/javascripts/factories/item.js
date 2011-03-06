//= require "../factory"

Factory.define('Item', {
  id: {
    sequence: 'id'
  },
  properties: {
    factories: 'Property'
  },
  title: 'Title',
  description: 'Lorem Ipsum...',
  sku: {
    sequence: 'sku'
  },
  price: 1000,
  taxable: true,
  discountable: false,
  locked: false,
  active: true
});