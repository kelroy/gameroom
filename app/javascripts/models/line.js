//= require "../model"

var Line = new JS.Class(Model, {
  extend: {
    resource: 'line',
    columns: ['id', 'transaction_id', 'item_id', 'title', 'description', 'quantity', 'condition', 'discount', 'price', 'credit', 'cash', 'purchase', 'taxable', 'discountable'],
    belongs_to: ['item', 'transaction'],
    'title': {
      'presence_of': {}
    }
  },
  
  subtotal: function() {
    if(this.purchase) {
      return Math.round(this.quantity * this.discount * this.price);
    } else {
      return Math.round(this.quantity * this.condition * this.credit * -1);
    }
  },
  
  creditSubtotal: function() {
    if(!this.purchase) {
      return parseInt(Math.round(this.quantity * this.credit * this.condition * -1));
    } else {
      return 0;
    }
  },
  
  cashSubtotal: function() {
    if(!this.purchase) {
      return parseInt(Math.round(this.quantity * this.cash * this.condition * -1));
    } else {
      return 0;
    }
  }
});