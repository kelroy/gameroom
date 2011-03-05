//= require "view_controller"
//= require "../boolean"

var CustomerReviewController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    $('div#customer_data h3#customer_name', this.view).html([
      customer.person.first_name,
      customer.person.middle_name,
      customer.person.last_name
    ].join(' '));
    if(customer.person.addresses.length > 0) {
      $('div#customer_data div#customer_addresses > p', this.view).html([
        customer.person.addresses[0].first_line,
        customer.person.addresses[0].second_line,
        customer.person.addresses[0].city + ',',
        customer.person.addresses[0].state,
        customer.person.addresses[0].zip
      ].join(' '));
    }
    if(customer.person.phones.length > 0){
      $('div#customer_data div#customer_phones > p', this.view).html(customer.person.phones[0].number);
    }
    if(customer.person.emails.length > 0){
      $('div#customer_data div#customer_emails > p', this.view).html(customer.person.emails[0].address);
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
    $('div#customer_data h3#customer_name', this.view).html(null);
    $('div#customer_data div#customer_addresses > p', this.view).html(null);
    $('div#customer_data div#customer_emails > p', this.view).html(null);
    $('div#customer_data div#customer_phones > p', this.view).html(null);
    $('div#customer_data div#customer_license > p', this.view).html(null);
    $('div#customer_data div#customer_notes > p', this.view).html(null);
    // Clear transaction history
  }
});