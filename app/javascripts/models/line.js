var Line = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.condition = 1;
    this.quantity = 0;
    this.price = 0;
    this.sell = false;
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
    this.setQuantity(params.quantity);
    this.setCondition(params.condition);
    if(params.sell) {
      this.setSell();
    } else {
      this.setPurchase();
    }
  },
  
  subtotal: function() {
    return this.quantity * this.price;
  },
  
  valid: function() {
    if(this.item != undefined) {
      return this.quantity > 0 && this.price >= 0 && this.item.valid();
    } else {
      return false;
    }
  },
  
  creditSubtotal: function() {
    if(this.sell) {
      return parseInt(Math.round(this.quantity * this.item.creditPrice() * this.condition * -1));
    } else {
      return 0;
    }
  },
  
  cashSubtotal: function() {
    if(this.sell) {
      return parseInt(Math.round(this.quantity * this.item.cashPrice() * this.condition * -1));
    } else {
      return 0;
    }
  },
  
  setQuantity: function(quantity) {
    this.quantity = quantity;
  },
  
  setCondition: function(condition) {
    this.condition = condition;
    this._calculatePrice();
  },
  
  setPurchase: function() {
    this.sell = false;
    this._calculatePrice();
  },
  
  setSell: function() {
    this.sell = true;
    this._calculatePrice();
  },
  
  _calculatePrice: function() {
    if(this.sell) {
      this.price = parseInt(this.item.creditPrice() * this.condition * -1);
    } else {
      this.price = this.item.basePrice();
    }
  }
});