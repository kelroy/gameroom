//= require "../factory"

Factory.define('Email', {
  id: {
    sequence: 'id'
  },
  address: 'example@example.com'
});