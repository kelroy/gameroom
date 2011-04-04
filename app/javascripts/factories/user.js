//= require "../factory"

Factory.define('User', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  login: 'login',
  email: 'example@example.com',
  pin: '1111',
  active: true
});