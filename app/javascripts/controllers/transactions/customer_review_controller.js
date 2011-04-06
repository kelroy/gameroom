//= require "../view_controller"
//= require "../../boolean"

var CustomerReviewController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    $('div#customer_data h3#customer_name', this.view).empty();
    $('div#customer_data div#customer_addresses > p', this.view).empty();
    $('div#customer_data div#customer_phones > p', this.view).empty();
    $('div#customer_data div#customer_emails > p', this.view).empty();
    
    person = customer.person();
    $('div#customer_data h3#customer_name', this.view).html([
      person.first_name,
      person.middle_name,
      person.last_name
    ].join(' '));
    
    if(person != undefined) {
      addresses = person.addresses();
      for(address in addresses) {
        $('div#customer_data div#customer_addresses > p', this.view).append('<address>' + [
          addresses[address].first_line,
          addresses[address].second_line,
          addresses[address].city + ',',
          addresses[address].state,
          addresses[address].zip
        ].join(' ') + '</address>');
      }
        
      phones = person.phones();
      for(phone in phones) {
        if(phones[phone].title != null) {
          phone_string = phones[phone].title + ' - ' + phones[phone].number;
        } else {
          phone_string = phones[phone].number;
        }
        $('div#customer_data div#customer_phones > p', this.view).append('<span>' + phone_string + '</span>');
      }
      
      emails = person.emails();
      for(email in emails) {
        $('div#customer_data div#customer_emails > p', this.view).append('<span>' + emails[email].address + '</span>');
      }
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
  }
});