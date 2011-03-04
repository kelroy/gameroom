//= require "table_controller"

var CartTableController = new JS.Class(TableController, {
  
  update: function(items) {
    this.reset();
    /*for(customer in customers){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', customers[customer].id);
      
      $('td.name', new_row).html(customers[customer].name);
      for(address in customers[customer].addresses) {
        address_string = [
          customers[customer].addresses[address].first_line, 
          customers[customer].addresses[address].second_line,
          customers[customer].addresses[address].city + ',',
          customers[customer].addresses[address].state,
          customers[customer].addresses[address].province,
          customers[customer].addresses[address].country,
          customers[customer].addresses[address].zip
        ].join(' ');
        $('td.address', new_row).append($('<address></address>').html(address_string));
      }
      for(phone in customers[customer].phones) {
        phone_string = customers[customer].phones[phone].title + ' - ' + customers[customer].phones[phone].number;
        $('td.phone', new_row).append($('<p></p>').html(phone_string));
      }
      for(email in customers[customer].emails) {
        email_string = customers[customer].emails[email].address;
        $('td.phone', new_row).append($('<p></p>').html(email_string));
      }
      $('td.credit', new_row).html(customers[customer].credit);
      $('td.drivers_license', new_row).html(customers[customer].drivers_license_number);
      $('td.flagged', new_row).html(customers[customer].active);
      $('td.notes', new_row).html(customers[customer].notes);
      $('tbody', this.view).append(new_row);
    }*/
  }
});