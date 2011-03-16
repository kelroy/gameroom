var Item = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/items/' + id,
        accept: 'application/json',
        dataType: 'json',
        success: function(results) {
          callback(results.item);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x'
      });
    },
    
    search: function(query, callback) {
      $.ajax({
        url: '/api/items/search',
        data: JSON.stringify({
          search: {
            title_or_description_or_sku_contains: query
          },
          page: 1,
          per_page: 25
        }),
        dataType: 'json',
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        type: 'POST',
        success: function(results) {
          callback(results);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x'
      });
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.properties = [];
    for(property in params.properties) {
      this.properties.push(new Property(params.properties[property]));
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
  
  basePrice: function() {
    return this.price;
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
    return this.title != '' && this.price >= 0;
  }
});