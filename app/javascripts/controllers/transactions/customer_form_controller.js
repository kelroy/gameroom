//= require "../form_controller"

var CustomerFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    if(customer != undefined) {
      $('input#customer_id', this.view).val(customer.id);
      $('input#customer_credit', this.view).val(Currency.format(customer.credit));
      $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
      $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
      $('input#customer_flagged', this.view).attr('checked', !customer.active);
      $('textarea#customer_notes', this.view).val(customer.notes);

      if(customer.person != undefined) {
        $('input#customer_person_first_name', this.view).val(customer.person.first_name);
        $('input#customer_person_middle_name', this.view).val(customer.person.middle_name);
        $('input#customer_person_last_name', this.view).val(customer.person.last_name);

        if(customer.person.addresses != undefined) {
          if(customer.person.addresses.length > 0){
            $('input#customer_person_address_first_line', this.view).val(customer.person.addresses[0].first_line);
            $('input#customer_person_address_second_line', this.view).val(customer.person.addresses[0].second_line);
            $('input#customer_person_address_city', this.view).val(customer.person.addresses[0].city);
            $('input#customer_person_address_state', this.view).val(customer.person.addresses[0].state);
            $('input#customer_person_address_zip', this.view).val(customer.person.addresses[0].zip);
          }
        }
        if(customer.person.phones != undefined) {
          if(customer.person.phones.length > 0){
            $('input#customer_person_phone_number', this.view).val(customer.person.phones[0].number);
          }
        }
        if(customer.person.emails != undefined) {
          if(customer.person.emails.length > 0){
            $('input#customer_person_email_address', this.view).val(customer.person.emails[0].address);
          }
        }
      } else {
        $('input#customer_person_first_name', this.view).val(null);
        $('input#customer_person_middle_name', this.view).val(null);
        $('input#customer_person_last_name', this.view).val(null);
        $('input#customer_person_address_first_line', this.view).val(null);
        $('input#customer_person_address_second_line', this.view).val(null);
        $('input#customer_person_address_city', this.view).val(null);
        $('input#customer_person_address_state', this.view).val(null);
        $('input#customer_person_address_zip', this.view).val(null);
        $('input#customer_person_phone_number', this.view).val(null);
        $('input#customer_person_email_address', this.view).val(null);
      }
    } else {
      this.reset();
    }
  },
  
  save: function() {
    address = new Address({
      first_line: $('input#customer_person_address_first_line', this.view).val(),
      second_line: $('input#customer_person_address_second_line', this.view).val(),
      city: $('input#customer_person_address_city', this.view).val(),
      state: $('input#customer_person_address_state', this.view).val(),
      zip: $('input#customer_person_address_zip', this.view).val(),
    });
    
    phone = new Phone({
      number: $('input#customer_person_phone_number', this.view).val()
    });
    
    email = new Email({
      address: $('input#customer_person_email_address', this.view).val()
    });
    
    person = new Person({
      first_name: $('input#customer_person_first_name', this.view).val(),
      middle_name: $('input#customer_person_middle_name', this.view).val(),
      last_name: $('input#customer_person_last_name', this.view).val(),
      addresses: [address],
      phones: [phone],
      emails: [email]
    });
    
    customer = new Customer({
      id: $('input#customer_id', this.view).val(),
      person: person,
      credit: parseInt(Currency.toPennies($('input#customer_credit', this.view).val())),
      notes: $('textarea#customer_notes', this.view).val(),
      drivers_license_number: $('input#customer_drivers_license_number', this.view).val(),
      drivers_license_state: $('input#customer_drivers_license_state', this.view).val(),
      active: !$('input#customer_flagged', this.view).is(':checked')
    });
    
    controller = this;
    customer.save(function(customer) {
      controller.update(new Customer(customer));
      controller.notifyObservers(new Customer(customer));
    });
  },
  
  reset: function() {
    this.callSuper();
    $('input#customer_credit', this.view).val(0);
  }
});