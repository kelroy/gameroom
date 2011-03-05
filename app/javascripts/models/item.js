var Item = new JS.Class({
  extend: {
    find: function(id) {
      return Factory.build('customer');
    },
    
    search: function(query) {
      return [];
    }
  },
  
  initialize: function() {
    this.quantity = 3;
    this.title = 'blak';
    this.description = 'Lorem...';
    this.sku = '11121222';
    this.price = 1234;
  },
});