//= require "../factory"

Factory.define('Timecard', {
  id: {
    sequence: 'id'
  },
  employee: {
    factory: 'Employee'
  },
  begin: new Date(),
  end: new Date()
});