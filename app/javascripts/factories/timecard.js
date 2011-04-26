//= require "../factory"

Factory.define('Timecard', {
  id: {
    sequence: 'id'
  },
  user: {
    factory: 'User'
  },
  begin: new Date(),
  end: new Date()
});