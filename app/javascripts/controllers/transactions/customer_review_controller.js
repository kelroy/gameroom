//= require "../view_controller"
//= require "../../boolean"

var CustomerReviewController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    $('div#customer_data div#customer_addresses > p', this.view).empty();
    $('div#customer_data div#customer_phones > p', this.view).empty();
    $('div#customer_data div#customer_emails > p', this.view).empty();
    
    if(customer.person != undefined) {
      $('div#customer_data h3#customer_name', this.view).html([
        customer.person.first_name,
        customer.person.middle_name,
        customer.person.last_name
      ].join(' '));
      
      if(customer.person.addresses != undefined) {
        if(customer.person.addresses.length > 0) {
          for(address in customer.person.addresses) {
            $('div#customer_data div#customer_addresses > p', this.view).append('<address>' + [
              customer.person.addresses[address].first_line,
              customer.person.addresses[address].second_line,
              customer.person.addresses[address].city + ',',
              customer.person.addresses[address].state,
              customer.person.addresses[address].zip
            ].join(' ') + '</address>');
          }
        }
      }
      if(customer.person.phones != undefined) {
        if(customer.person.phones.length > 0){
          for(phone in customer.person.phones) {
            if(customer.person.phones[phone].title != null) {
              phone_string = customer.person.phones[phone].title + ' - ' + customer.person.phones[phone].number;
            } else {
              phone_string = customer.person.phones[phone].number;
            }
            $('div#customer_data div#customer_phones > p', this.view).append('<span>' + phone_string + '</span>');
          }
        }
      }
      if(customer.person.emails != undefined) {
        if(customer.person.emails.length > 0){
          for(email in customer.person.emails) {
            $('div#customer_data div#customer_emails > p', this.view).append('<span>' + customer.person.emails[email].address + '</span>');
          }
        }
      }
    } else {
      $('div#customer_data h3#customer_name', this.view).empty();
    }
    
    $('div#customer_data div#customer_license > p', this.view).html([
      customer.drivers_license_state,
      customer.drivers_license_number
    ].join(' - '));
    $('div#customer_data div#customer_notes > p', this.view).html(customer.notes);
    $('div#customer_data div#customer_flagged > p', this.view).html(Boolean.toString(!customer.active));
    $('div#customer_data div#customer_credit > p', this.view).html(Currency.pretty(customer.credit));
    $('h2#customer_notice').hide();
    $('div#customer_data').show();
  },
  
  reset: function() {
    $('h2#customer_notice').show();
    $('div#customer_data').hide();
    $('div#customer_data h3#customer_name', this.view).html(null);
    $('div#customer_data div#customer_addresses > p', this.view).html(null);
    $('div#customer_data div#customer_emails > p', this.view).html(null);
    $('div#customer_data div#customer_phones > p', this.view).html(null);
    $('div#customer_data div#customer_license > p', this.view).html(null);
    $('div#customer_data div#customer_notes > p', this.view).html(null);
    // Clear transaction history
  }
});