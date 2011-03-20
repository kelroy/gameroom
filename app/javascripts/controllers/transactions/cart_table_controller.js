//= require "../table_controller"

var CartTableController = new JS.Class(TableController, {
  
  update: function(items) {
    this.reset();
    
    for(item in items){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', items[item].id);
      
      if(items[item].description == null || items[item].description == undefined) {
        items[item].description = '';
      }
 
      $('td.title', new_row).html(items[item].title);
      $('td.description', new_row).html(String.truncate(items[item].description, 50)).attr('title', items[item].description);
      $('td.sku', new_row).html(items[item].sku);
      $('td.price', new_row).html(Currency.pretty(items[item].price));
      $('td.taxable', new_row).html(Boolean.toString(items[item].taxable));
      for(property in items[item].properties) {
        processed = this._processProperty(items[item].properties[property]);
        $('td.properties ul', new_row).append('<li><span>' + processed.key + ': </span><span>' + processed.value + '</span></li>');
      }
      $('tbody', this.view).append(new_row);
    }
  },
  
  _processProperty: function(property) {
    switch(property.key) {
      case 'credit_price':
      case 'cash_price':
        property.value = Currency.pretty(property.value);
        break;
      default:
        break;
    }
    property.key = String.capitalize(property.key.split('_').join(' '));
    return property;
  }
});