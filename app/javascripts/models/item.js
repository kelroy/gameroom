var Item = new JS.Class({
  extend: {
    find: function(id) {
      credit = new Property({});
      credit.key = 'credit_price';
      credit.value = 800;
      cash = new Property({});
      cash.key = 'cash_price';
      cash.value = 500;
      return Factory.build('Item', {properties: [
        credit,
        cash
      ]});
    },
    
    search: function(query) {
      results = [];
      credit = new Property({});
      credit.key = 'credit_price';
      credit.value = 800;
      cash = new Property({});
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
  
  initialize: function(params) {
    this.id = params.id;
    this.properties = [];
    for(property in properties) {
      this.properties.push(new Property(properties[property].property));
    }
    this.title = params.title;
    this.description = params.description;
    this.sku = params.sku;
    this.price = params.price;
    this.taxable = params.taxable;
    this.discountable = params.discountable;
    this.locked = params.locked;
    this.active = params.active;
  },
  
  creditPrice: function() {
    var credit_price = 0;
    for(property in this.properties) {
      switch(this.properties[property].key) {
        case 'credit_price':
          credit_price = parseInt(this.properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return credit_price;
  },
  
  cashPrice: function() {
    var cash_price = 0;
    for(property in this.properties) {
      switch(this.properties[property].key) {
        case 'cash_price':
          cash_price = parseInt(this.properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return cash_price;
  },
  
  valid: function() {
    return this.title != '' && this.price > 0;
  }
});