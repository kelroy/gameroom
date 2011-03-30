//= require "../model"

var Line = new JS.Class(Model, {
  extend: {
    resource: 'line',
    belongs_to: ['item', 'transaction']
  },
  
  subtotal: function() {
    if(this.purchase) {
      return Math.round(this.quantity * this.discount * this.condition * this.price);
    } else {
      return Math.round(this.quantity * this.discount * this.condition * this.credit * -1);
    }
  },
  
  valid: function() {
    return this.quantity >= 0 && this.condition >= 0 && this.discount >= 0 && this.price >= 0 && this.cash >= 0 && this.credit >= 0;
  },
  
  creditSubtotal: function() {
    if(!this.purchase) {
      return parseInt(Math.round(this.quantity * this.credit * this.discount * this.condition * -1));
    } else {
      return 0;
    }
  },
  
  cashSubtotal: function() {
    if(!this.purchase) {
      return parseInt(Math.round(this.quantity * this.cash * this.discount * this.condition * -1));
    } else {
      return 0;
    }
  }
});