//= require "../model"
//= require "property"
//= require "line"

var Item = new JS.Class(Model, {
  extend: {
    resource: 'item'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.sku = params.sku;
    this.price = params.price;
    this.taxable = params.taxable;
    this.discountable = params.discountable;
    this.locked = params.locked;
    this.active = params.active;
  },
  
  properties: function() {
    return this._find_children('property');
  },
  
  basePrice: function() {
    return this.price;
  },
  
  creditPrice: function() {
    credit_price = 0;
    properties = this.properties();
    for(property in properties) {
      switch(properties[property].key) {
        case 'credit_price':
          credit_price = parseInt(properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return credit_price;
  },
  
  cashPrice: function() {
    cash_price = 0;
    properties = this.properties();
    for(property in properties) {
      switch(properties[property].key) {
        case 'cash_price':
          cash_price = parseInt(properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return cash_price;
  },
  
  valid: function() {
    return this.title != '' && this.price >= 0;
  }
});