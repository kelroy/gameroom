//= require "../table_controller"

var CartTableController = new JS.Class(TableController, {
  
  update: function(items) {
    this.reset();
    
    if(items.length > 0) {
      for(item in items){
        new_row = $(this.table_row).clone();
        new_row.attr('data-object-id', items[item].id);

        if(items[item].description == null || items[item].description == undefined) {
          items[item].description = '';
        }

        $('td.title', new_row).html(items[item].title);
        $('td.description', new_row).html(items[item].description.truncate(50)).attr('title', items[item].description);
        $('td.tags', new_row).html(items[item].tags);
        $('td.sku', new_row).html(items[item].sku);
        $('td.price', new_row).html(Currency.pretty(items[item].price));
        $('td.credit', new_row).html(Currency.pretty(items[item].credit));
        $('td.cash', new_row).html(Currency.pretty(items[item].cash));
        $('td.taxable', new_row).html(Boolean.toString(items[item].taxable));
        $('td.discountable', new_row).html(Boolean.toString(items[item].discountable));
        $('tbody', this.view).append(new_row);
      }
      this.view.show();
    } else {
      this.view.hide();
    }
  },
  
  _processProperty: function(property) {
    property.key = property.key.split('_').join(' ').capitalize();
    return property;
  }
});