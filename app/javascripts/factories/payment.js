//= require "../factory"

Factory.define('Payment', {
  id: {
    sequence: 'id'
  },
  transaction: {
    factory: 'Transaction'
  },
  form: 'cash',
  amount: 0
});