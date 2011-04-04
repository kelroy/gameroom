//= require "../factory"

Factory.define('Phone', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  title: 'Work',
  number: '402-444-5555'
});