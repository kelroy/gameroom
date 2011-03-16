var Line = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    if(params.transaction != undefined) {
      this.transaction = new Transaction(params.transaction);
    } else {
      this.transaction = undefined;
    }
    if(params.item != undefined) {
      this.item = new Item(params.item);
    } else {
      this.item = undefined;
    }
    this.sell = params.sell;
    this.condition = params.condition;
    this.quantity = params.quantity;
    this.price = params.price;
  },
  
  subtotal: function() {
    return this.quantity * this.price;
  },
  
  valid: function() {
    if(this.item != undefined) {
      return this.quantity > 0 && this.price >= 0 && this.item.valid();
    } else {
      return this.quantity > 0 && this.price >= 0;
    }
  },
  
  setCondition: function(condition) {
    this.condition = condition;
    this.price = parseInt(this.item.creditPrice() * this.condition);
  },
  
  setPurchase: function() {
    this.sell = false;
    this.price = this.item.basePrice();
  },
  
  setSell: function() {
    this.sell = true;
    this.price = parseInt(this.item.creditPrice() * -1);
  }
});