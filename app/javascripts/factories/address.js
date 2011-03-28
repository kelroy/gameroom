//= require "../factory"

Factory.define('Address', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  first_line: '555 Street Way',
  second_line: 'Suite 309',
  city: 'Lincoln',
  state: 'NE',
  province: '',
  country: 'US',
  zip: '68508'
});