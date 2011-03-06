var Item = new JS.Class({
  extend: {
    find: function(id) {
      return Factory.build('Item');
    },
    
    search: function(query) {
      results = [];
      for(i = 0; i < 5; i++){
        results.push(Factory.build('Item'));
      }
      return results;
    }
  },
  
  initialize: function() {
    this.id = null;
    this.properties = [];
    this.title = null;
    this.description = null;
    this.sku = null;
    this.price = 0;
    this.taxable = false;
    this.discountable = false;
    this.locked = false;
    this.active = false;
  },
  
  valid: function() {
    return true;
  }
});