//= require "../model"
//= require "entry"

var Till = new JS.Class(Model, {
  extend: {
    resource: 'till',
    columns: ['id', 'title', 'description', 'minimum_transfer', 'minimum_balance', 'retainable', 'active'],
    has_many: ['entries', 'transactions', 'employees']
  },
  
  balance: function() {
    balance = 0;
    this.klass._ajax('/api/' + this.klass.resource.pluralize() + '/' + this.id + '/balance', 'GET', null, function(result) {
      balance = result.balance;
    });
    
    return balance;
  }
});