var Line = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.transaction = null;
    this.item = null;
    this.sell = false;
    this.condition = 5;
    this.quantity = 0;
    this.price = 0;
  },
  
  subtotal: function() {
    return this.quantity * this._price();
  },
  
  _price: function() {
    if(this.sell) {
      this.price = this.item.creditPrice() * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
    return this.price;
  },
  
  purchaseSubtotal: function() {
    if(this.sell) {
      return 0;
    } else {
      return this._price();
    }
  },
  
  creditSubtotal: function() {
    if(this.sell && this.item != null) {
      return this.quantity * this.item.creditPrice();
    } else {
      return 0;
    }
  },
  
  cashSubtotal: function() {
    if(this.sell && this.item != null) {
      return this.quantity * this.item.cashPrice();
    } else {
      return 0;
    }
  },
  
  valid: function() {
    if(this.item != null) {
      return this.quantity > 0 && this.price > 0 && this.item.valid();
    } else {
      return this.quantity > 0 && this.price > 0;
    }
  }
});