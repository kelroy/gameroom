var Item = new JS.Class({
  extend: {
    find: function(id) {
      credit = new Property();
      credit.key = 'credit_price';
      credit.value = 800;
      cash = new Property();
      cash.key = 'cash_price';
      cash.value = 500;
      return Factory.build('Item', {properties: [
        credit,
        cash
      ]});
    },
    
    search: function(query) {
      results = [];
      credit = new Property();
      credit.key = 'credit_price';
      credit.value = 800;
      cash = new Property();
      cash.key = 'cash_price';
      cash.value = 500;
      for(i = 0; i < 5; i++){
        results.push(Factory.build('Item', {properties: [
          credit,
          cash
        ]}));
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