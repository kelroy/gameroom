//= require "../../sectionable"
//= require "../view_controller"
//= require "../../boolean"

var TransactionsCustomerReviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    $('div#transactions_customer_data h3#transactions_customer_name', this.view).empty();
    $('div#transactions_customer_data div#transactions_customer_addresses > p', this.view).empty();
    $('div#transactions_customer_data div#transactions_customer_phones > p', this.view).empty();
    $('div#transactions_customer_data div#transactions_customer_emails > p', this.view).empty();
    
    person = customer.person();
    if(person != undefined) {
      $('div#transactions_customer_data h3#transactions_customer_name', this.view).html([
        person.first_name,
        person.middle_name,
        person.last_name
      ].join(' '));
      $('div#transactions_customer_data div#transactions_customer_license > p', this.view).html(person.drivers_license);
      
      addresses = person.addresses;
      for(address in addresses) {
        $('div#transactions_customer_data div#transactions_customer_addresses > p', this.view).append('<address>' + addresses[address] + '</address>');
      }
        
      phones = person.phones;
      for(phone in phones) {
        $('div#transactions_customer_data div#transactions_customer_phones > p', this.view).append('<span>' + phones[phone] + '</span>');
      }
      
      emails = person.emails;
      for(email in emails) {
        $('div#transactions_customer_data div#transactions_customer_emails > p', this.view).append('<span>' + emails[email] + '</span>');
      }
    }
    
    $('div#transactions_customer_data div#transactions_customer_notes > p', this.view).html(customer.notes);
    $('div#transactions_customer_data div#transactions_customer_flagged > p', this.view).html(Boolean.toString(!customer.active));
    $('div#transactions_customer_data div#transactions_customer_credit > p', this.view).html(Currency.pretty(customer.credit));
    $('h2#transactions_customer_notice').hide();
    $('div#transactions_customer_data').show();
  },
  
  reset: function() {
    $('h2#transactions_customer_notice').show();
    $('div#transactions_customer_data').hide();
    $('div#transactions_customer_data h3#transactions_customer_name', this.view).html(null);
    $('div#transactions_customer_data div#transactions_customer_addresses > p', this.view).html(null);
    $('div#transactions_customer_data div#transactions_customer_emails > p', this.view).html(null);
    $('div#transactions_customer_data div#transactions_customer_phones > p', this.view).html(null);
    $('div#transactions_customer_data div#transactions_customer_license > p', this.view).html(null);
    $('div#transactions_customer_data div#transactions_customer_notes > p', this.view).html(null);
  }
});