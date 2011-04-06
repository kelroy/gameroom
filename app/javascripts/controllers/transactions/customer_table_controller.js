//= require "../table_controller"
//= require "../../boolean"

var CustomerTableController = new JS.Class(TableController, {
  
  update: function(people) {
    this.reset();
    
    for(person in people){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', people[person].id);
      
      $('td.name', new_row).html([
        people[person].first_name,
        people[person].last_name
      ].join(' '));
      
      addresses = people[person].addresses();
      for(address in addresses) {
        address_string = [
          addresses[address].first_line, 
          addresses[address].second_line,
          addresses[address].city + ',',
          addresses[address].state,
          addresses[address].province,
          addresses[address].country,
          addresses[address].zip
        ].join(' ');
        $('td.address', new_row).append($('<address></address>').html(address_string));
      }
        
      phones = people[person].phones();
      for(phone in phones) {
        if(phones[phone].title != null) {
          phone_string = phones[phone].title + ' - ' + phones[phone].number;
        } else {
          phone_string = phones[phone].number;
        }
        $('td.phone', new_row).append($('<p></p>').html(phone_string));
      }
      
      emails = people[person].emails();
      for(email in emails) {
        email_string = emails[email].address;
        $('td.email', new_row).append($('<p></p>').html(email_string));
      }
      
      customer = people[person].customer();
      if(customer != undefined) {
        $('td.credit', new_row).html(Currency.pretty(customer.credit));
        $('td.drivers_license', new_row).html([
          customer.drivers_license_number,
          customer.drivers_license_state
        ].join(' '));
        $('td.flagged', new_row).html(Boolean.toString(!customer.active));
        $('td.notes', new_row).html(customer.notes);
        $('tbody', this.view).append(new_row);
      }
    }
  }
});