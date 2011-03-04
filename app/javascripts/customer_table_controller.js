//= require "table_controller"

var CustomerTableController = new JS.Class(TableController, {
  
  update: function(customers) {
    this.reset();
    for(customer in customers){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', customers[customer].id);
      $('td.name', new_row).html(customers[customer].name);
      $('td.address', new_row).html(customers[customer].address);
      $('td.phone', new_row).html(customers[customer].phone);
      $('td.email', new_row).html(customers[customer].email);
      $('td.credit', new_row).html(customers[customer].credit);
      $('td.drivers_license', new_row).html(customers[customer].drivers_license_number);
      $('td.flagged', new_row).html(customers[customer].active);
      $('td.notes', new_row).html(customers[customer].notes);
      $('tbody', this.view).append(new_row);
    }
  }
});