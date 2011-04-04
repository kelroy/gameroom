//= require "../factory"

Factory.define('Employee', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  rate: 0,
  active: true
});