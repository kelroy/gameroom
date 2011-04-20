//= require "../../sectionable"
//= require "../form_controller"

var CustomerFormController = new JS.Class(FormController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    this.reset();
    
    $('input#customer_id', this.view).val(customer.id);
    $('input#customer_credit', this.view).val(Currency.format(customer.credit));
    $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
    $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
    $('input#customer_flagged', this.view).attr('checked', !customer.active);
    $('textarea#customer_notes', this.view).val(customer.notes);
    
    person = customer.person();
    if(person != undefined) {
      $('input#customer_person_first_name', this.view).val(person.first_name);
      $('input#customer_person_middle_name', this.view).val(person.middle_name);
      $('input#customer_person_last_name', this.view).val(person.last_name);
      
      addresses = person.addresses();
      if(addresses.length > 0) {
        $('input#customer_person_address_first_line', this.view).val(addresses[0].first_line);
        $('input#customer_person_address_second_line', this.view).val(addresses[0].second_line);
        $('input#customer_person_address_city', this.view).val(addresses[0].city);
        $('input#customer_person_address_state', this.view).val(addresses[0].state);
        $('input#customer_person_address_zip', this.view).val(addresses[0].zip);
      }

      phones = person.phones();
      if(phones.length > 0){
        $('input#customer_person_phone_number', this.view).val(phones[0].number);
      }

      emails = person.emails();
      if(emails.length > 0){
        $('input#customer_person_email_address', this.view).val(emails[0].address);
      }
    }
  },
  
  save: function() {
    if(this.valid()) {
      if($('input#customer_id', this.view).val() > 0) {
        customer = Customer.find($('input#customer_id', this.view).val());
        customer.credit = parseInt(Currency.toPennies($('input#customer_credit', this.view).val()));
        customer.notes = $('textarea#customer_notes', this.view).val();
        customer.drivers_license_number = $('input#customer_drivers_license_number', this.view).val();
        customer.drivers_license_state = $('input#customer_drivers_license_state', this.view).val();
        customer.active = !$('input#customer_flagged', this.view).is(':checked');
        customer.save();
        
        if(customer != undefined) {
          person = customer.person();
          if(person != undefined) {
            person.first_name = $('input#customer_person_first_name', this.view).val();
            person.middle_name = $('input#customer_person_middle_name', this.view).val();
            person.last_name = $('input#customer_person_last_name', this.view).val();
            person.save();
            
            addresses = person.addresses();
            if(addresses.length > 0) {
              addresses[0].first_line =  $('input#customer_person_address_first_line', this.view).val();
              addresses[0].second_line = $('input#customer_person_address_second_line', this.view).val();
              addresses[0].city = $('input#customer_person_address_city', this.view).val();
              addresses[0].state = $('input#customer_person_address_state', this.view).val();
              addresses[0].zip = $('input#customer_person_address_zip', this.view).val();
              addresses[0].save();
            } else {
              address = new Address({
                first_line: $('input#customer_person_address_first_line', this.view).val(),
                second_line: $('input#customer_person_address_second_line', this.view).val(),
                city: $('input#customer_person_address_city', this.view).val(),
                state: $('input#customer_person_address_state', this.view).val(),
                zip: $('input#customer_person_address_zip', this.view).val(),
              });
              address.setPerson(person);
              address.save();
            }
            
            phones = person.phones();
            if(phones.length > 0) {
              phones[0].number =  $('input#customer_person_phone_number', this.view).val();
              phones[0].save();
            } else {
              phone = new Phone({
                number: $('input#customer_person_phone_number', this.view).val()
              });
              phone.setPerson(person);
              phone.save();
            }
            
            emails = person.emails();
            if(emails.length > 0) {
              emails[0].address =  $('input#customer_person_email_address', this.view).val();
              emails[0].save();
            } else {
              email = new Email({
                address: $('input#customer_person_email_address', this.view).val()
              });
              email.setPerson(person);
              email.save();
            }
            
            customer.setPerson(person);
          }
        }        
      } else {
        person = new Person({
          first_name: $('input#customer_person_first_name', this.view).val(),
          middle_name: $('input#customer_person_middle_name', this.view).val(),
          last_name: $('input#customer_person_last_name', this.view).val()
        });
        if(person.save()) {
          address = new Address({
            first_line: $('input#customer_person_address_first_line', this.view).val(),
            second_line: $('input#customer_person_address_second_line', this.view).val(),
            city: $('input#customer_person_address_city', this.view).val(),
            state: $('input#customer_person_address_state', this.view).val(),
            zip: $('input#customer_person_address_zip', this.view).val(),
          });
          address.setPerson(person);
          address.save();

          phone = new Phone({
            number: $('input#customer_person_phone_number', this.view).val()
          });
          phone.setPerson(person);
          phone.save();

          email = new Email({
            address: $('input#customer_person_email_address', this.view).val()
          });
          email.setPerson(person);
          email.save();
        }

        customer = new Customer({
          credit: parseInt(Currency.toPennies($('input#customer_credit', this.view).val())),
          notes: $('textarea#customer_notes', this.view).val(),
          drivers_license_number: $('input#customer_drivers_license_number', this.view).val(),
          drivers_license_state: $('input#customer_drivers_license_state', this.view).val(),
          active: !$('input#customer_flagged', this.view).is(':checked')
        });
        customer.setPerson(person);
      }
      if(customer.save()) {
        this.update(customer);
        this.notifyObservers(customer);
      }
    } else {
      this.error();
    }
  },
  
  valid: function() {
    if($('input#customer_person_first_name', this.view).val() == '') {
      return false;
    }
    if($('input#customer_person_last_name', this.view).val() == '') {
      return false;
    }
    if($('input#customer_person_phone_number', this.view).val() == '' &&
       $('input#customer_person_email_address', this.view).val() == '' &&
       $('input#customer_drivers_license_number', this.view).val() == '' &&
       $('input#customer_drivers_license_number', this.view).val() == '') {
      return false;
    }
    return true;
  },
  
  error: function() {
    $(':required', this.view).addClass('error');
  },
  
  reset: function() {
    this.callSuper();
    $('input#customer_id', this.view).val(0);
    $('input#customer_credit', this.view).val(Currency.format(0));
    $(':required', this.view).removeClass('error');
  }
});