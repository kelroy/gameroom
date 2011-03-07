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
  
  calculatePrice: function() {
    if(this.sell) {
      for(property in this.item.properties) {
        switch(this.item.properties[property].key) {
          case 'credit_price':
            var credit_price = parseInt(this.item.properties[property].value);
            break;
          case 'default':
            break;
        }
      }
      this.price = credit_price * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
  },
  
  calculateSubtotal: function() {
    return this.quantity * this.price;
  },
  
  valid: function() {
    return true;
  }
});