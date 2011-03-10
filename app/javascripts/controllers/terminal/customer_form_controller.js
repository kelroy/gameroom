//= require "../form_controller"

var CustomerFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    $('input#customer_person_first_name', this.view).val(customer.person.first_name);
    $('input#customer_person_middle_name', this.view).val(customer.person.middle_name);
    $('input#customer_person_last_name', this.view).val(customer.person.last_name);
    $('input#customer_credit', this.view).val(Currency.format(customer.credit));
    $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
    $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
    $('input#customer_flagged', this.view).attr('checked', !customer.active);
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
    address = new Address();
    address.first_line = $('input#customer_person_address_first_line', this.view).val();
    address.second_line = $('input#customer_person_address_second_line', this.view).val();
    address.city = $('input#customer_person_address_city', this.view).val();
    address.state = $('input#customer_person_address_state', this.view).val();
    address.zip = $('input#customer_person_address_zip', this.view).val();
    
    phone = new Phone();
    phone.number = $('input#customer_person_phone_number', this.view).val();
    
    email = new Email();
    email.address = $('input#customer_person_email_address', this.view).val();
    
    person = new Person();
    person.first_name = $('input#customer_person_first_name', this.view).val();
    person.middle_name = $('input#customer_person_middle_name', this.view).val();
    person.last_name = $('input#customer_person_last_name', this.view).val();
    person.addresses.push(address);
    person.phones.push(phone);
    person.emails.push(email);
    
    customer = new Customer();
    customer.id = $('input#customer_id', this.view).val();
    customer.credit = parseInt(Currency.toPennies($('input#customer_credit', this.view).val()));
    customer.notes = $('textarea#customer_notes', this.view).val();
    customer.drivers_license_number = $('input#customer_drivers_license_number', this.view).val();
    customer.drivers_license_state = $('input#customer_drivers_license_state', this.view).val();
    customer.active = !$('input#customer_flagged', this.view).is(':checked');
    customer.person = person;
    
    if(customer.save()) {
      this.update(customer);
      this.notifyObservers(customer);
    }
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