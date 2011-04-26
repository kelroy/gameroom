//= require "../factory"

Factory.define('User', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  rate: 0,
  active: true
});