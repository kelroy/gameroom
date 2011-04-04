//= require "../factory"

Factory.define('Transaction', {
  id: {
    sequence: 'id'
  },
  till: {
    factory: 'Till'
  },
  customer: {
    factory: 'Customer'
  },
  lines: {
    factories: 'Line'
  },
  payments: {
    factories: 'Payment'
  },
  tax_rate: 0.07,
  complete: false,
  locked: false
});