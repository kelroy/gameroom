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
    return this.quantity * this._creditPrice();
  },
  
  _creditPrice: function() {
    if(this.sell) {
      this.price = this.item.creditPrice() * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
    return this.price;
  },
  
  _cashPrice: function() {
    if(this.sell) {
      this.price = this.item.cashPrice() * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
    return this.price;
  },
  
  purchaseCreditSubtotal: function() {
    if(this.sell) {
      return 0;
    } else {
      return this.quantity * this._creditPrice();
    }
  },
  
  creditSubtotal: function() {
    if(this.sell) {
      return this.quantity * this._creditPrice();
    } else {
      return 0;
    }
  },
  
  cashSubtotal: function() {
    if(this.sell) {
      return this.quantity * this._cashPrice();
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