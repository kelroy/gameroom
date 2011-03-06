//= require "table_controller"

var CartTableController = new JS.Class(TableController, {
  
  update: function(items) {
    this.reset();
    for(item in items){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', items[item].id);
      
      $('td.title', new_row).html(items[item].title);
      $('td.description', new_row).html(items[item].description);
      $('td.sku', new_row).html(items[item].sku);
      $('td.price', new_row).html(Currency.pretty(items[item].price));
      $('td.taxable', new_row).html(Boolean.toString(items[item].taxable));
      for(property in items[item].properties) {
        switch(items[item].properties[property].key) {
          case 'credit_price':
            $('td.credit_price', new_row).html(items[item].properties[property].value);
            break;
          case 'cash_price':
            $('td.cash_price', new_row).html(items[item].properties[property].value);
            break;
          default:
            break;
        }
      }
      $('tbody', this.view).append(new_row);
    }
  }
});