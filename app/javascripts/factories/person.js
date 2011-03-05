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
  first_name: 'First',
  middle_name: 'Middle',
  last_name: 'Last',
  date_of_birth: new Date()
});