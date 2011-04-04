//= require "../factory"

Factory.define('Person', {
  id: {
    sequence: 'id'
  },
  phones: {
    factories: 'Phone'
  },
  emails: {
    factories: 'Email'
  },
  addresses: {
    factories: 'Address'
  },
  first_name: 'Joe',
  middle_name: 'Q',
  last_name: 'Example',
  date_of_birth: new Date()
});