//= require "form_controller"

var CustomerFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    $('input#customer_person_first_name', this.view).val(customer.person.first_name);
    $('input#customer_person_middle_name', this.view).val(customer.person.middle_name);
    $('input#customer_person_last_name', this.view).val(customer.person.last_name);
    $('input#customer_credit', this.view).val(customer.credit);
    $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
    $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
    $('input#customer_flagged', this.view).val(!customer.active);
    $('textarea#customer_notes', this.view).val(customer.notes);
    if(customer.person.addresses.length > 0){
      $('input#customer_person_address_first_line', this.view).val(customer.person.addresses[0].first_line);
      $('input#customer_person_address_second_line', this.view).val(customer.person.addresses[0].second_line);
      $('input#customer_person_address_city', this.view).val(customer.person.addresses[0].city);
      $('input#customer_person_address_state', this.view).val(customer.person.addresses[0].state);
      $('input#customer_person_address_zip', this.view).val(customer.person.addresses[0].zip);
    }
    if(customer.person.phones.length > 0){
      $('input#customer_person_phone_number', this.view).val(customer.person.phones[0].number);
    }
    if(customer.person.emails.length > 0){
      $('input#customer_person_email_address', this.view).val(customer.person.emails[0].address);
    }
  },
  
  save: function() {
    // Do customer save
    //this.notifyObservers(new Customer());
  },
  
  reset: function() {
    this.callSuper();
    $('input#customer_credit', this.view).val(0);
  },
  
  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});