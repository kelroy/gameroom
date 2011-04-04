//= require "../factory"

Factory.define('Line', {
  id: {
    sequence: 'id'
  },
  properties: {
    factories: 'Item'
  },
  quantity: 1,
  price: 1000
});