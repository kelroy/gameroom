//= require "../table_controller"
//= require "../../boolean"

var TransactionsCustomerTableController = new JS.Class(TableController, {
  
  update: function(people) {
    this.reset();
    
    if(people.length > 0) {
      for(person in people){
        new_row = $(this.table_row).clone();
        new_row.attr('data-object-id', people[person].id);
        
        $('td.name', new_row).html([
          people[person].first_name,
          people[person].last_name
        ].join(' '));
        $('td.drivers_license', new_row).html(people[person].drivers_license);

        addresses = people[person].addresses;
        for(address in addresses) {
          $('td.address', new_row).append($('<address></address>').html(addresses[address]));
        }

        phones = people[person].phones;
        for(phone in phones) {
          $('td.phone', new_row).append($('<p></p>').html(phones[phone]));
        }

        emails = people[person].emails;
        for(email in emails) {
          $('td.email', new_row).append($('<p></p>').html(emails[email]));
        }

        customer = people[person].customer();
        if(customer != undefined) {
          $('td.credit', new_row).html(Currency.pretty(customer.credit));
          $('td.flagged', new_row).html(Boolean.toString(!customer.active));
          $('td.notes', new_row).html(customer.notes);
          $('tbody', this.view).append(new_row);
        }
      }
      this.view.show();
    } else {
      this.view.hide();
    }
  }
});