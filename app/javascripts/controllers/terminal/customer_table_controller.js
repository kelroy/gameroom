//= require "../table_controller"
//= require "../../boolean"

var CustomerTableController = new JS.Class(TableController, {
  
  update: function(customers) {
    this.reset();
    
    for(customer in customers){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', customers[customer].id);
      
      $('td.name', new_row).html([
        customers[customer].person.first_name,
        customers[customer].person.last_name
      ].join(' '));
      for(address in customers[customer].person.addresses) {
        address_string = [
          customers[customer].person.addresses[address].first_line, 
          customers[customer].person.addresses[address].second_line,
          customers[customer].person.addresses[address].city + ',',
          customers[customer].person.addresses[address].state,
          customers[customer].person.addresses[address].province,
          customers[customer].person.addresses[address].country,
          customers[customer].person.addresses[address].zip
        ].join(' ');
        $('td.address', new_row).append($('<address></address>').html(address_string));
      }
      for(phone in customers[customer].person.phones) {
        if(customers[customer].person.phones[phone].title != null) {
          phone_string = customers[customer].person.phones[phone].title + ' - ' + customers[customer].person.phones[phone].number;
        } else {
          phone_string = customers[customer].person.phones[phone].number;
        }
        $('td.phone', new_row).append($('<p></p>').html(phone_string));
      }
      for(email in customers[customer].person.emails) {
        email_string = customers[customer].person.emails[email].address;
        $('td.email', new_row).append($('<p></p>').html(email_string));
      }
      $('td.credit', new_row).html(Currency.pretty(customers[customer].credit));
      $('td.drivers_license', new_row).html([
        customers[customer].drivers_license_number,
        customers[customer].drivers_license_state
      ].join(' '));
      $('td.flagged', new_row).html(Boolean.toString(!customers[customer].active));
      $('td.notes', new_row).html(customers[customer].notes);
      $('tbody', this.view).append(new_row);
    }
  }
});