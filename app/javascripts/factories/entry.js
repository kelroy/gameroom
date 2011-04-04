//= require "../factory"

Factory.define('Entry', {
  id: {
    sequence: 'id'
  },
  till: {
    factory: 'Till'
  },
  title: 'Title',
  description: 'Lorem Ipsum...',
  time: new Date(),
  amount: 0
});