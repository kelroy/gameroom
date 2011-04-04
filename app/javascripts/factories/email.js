//= require "../factory"

Factory.define('Email', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  address: 'example@example.com'
});