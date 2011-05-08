//= require "../../sectionable"
//= require "../form_controller"

var TransactionsCustomerFormController = new JS.Class(FormController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    this.reset();
    
    $('input#id', this.view).val(customer.id);
    $('input#credit', this.view).val(Currency.format(customer.credit));
    $('input#drivers_license_number', this.view).val(customer.drivers_license_number);
    $('input#drivers_license_state', this.view).val(customer.drivers_license_state);
    $('input#flagged', this.view).attr('checked', !customer.active);
    $('textarea#notes', this.view).val(customer.notes);
    
    person = customer.person();
    if(person != undefined) {
      $('input#first_name', this.view).val(person.first_name);
      $('input#middle_name', this.view).val(person.middle_name);
      $('input#last_name', this.view).val(person.last_name);
      if(person.date_of_birth == null || person.date_of_birth == undefined) {
        person.date_of_birth = new Date();
      }
      date_of_birth = (new Date()).setISO8601(person.date_of_birth);
      $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
      $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
      $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
      
      addresses = person.addresses();
      if(addresses.length > 0) {
        $('input#first_line', this.view).val(addresses[0].first_line);
        $('input#second_line', this.view).val(addresses[0].second_line);
        $('input#city', this.view).val(addresses[0].city);
        $('input#state', this.view).val(addresses[0].state);
        $('input#zip', this.view).val(addresses[0].zip);
      }

      phones = person.phones();
      if(phones.length > 0){
        $('input#number', this.view).val(phones[0].number);
      }

      emails = person.emails();
      if(emails.length > 0){
        $('input#address', this.view).val(emails[0].address);
      }
    }
  },
  
  save: function() {
    if(this.valid()) {
      if($('input#id', this.view).val() > 0) {
        customer = Customer.find($('input#id', this.view).val());
        customer.credit = parseInt(Currency.toPennies($('input#credit', this.view).val()));
        customer.notes = $('textarea#notes', this.view).val();
        customer.drivers_license_number = $('input#drivers_license_number', this.view).val();
        customer.drivers_license_state = $('input#drivers_license_state', this.view).val();
        customer.active = !$('input#flagged', this.view).is(':checked');
        customer.save();
        
        if(customer != undefined) {
          person = customer.person();
          if(person != undefined) {
            date_of_birth_year = $('select#date_of_birth_year').val();
            date_of_birth_month = $('select#date_of_birth_month').val() - 1;
            date_of_birth_day = $('select#date_of_birth_day').val();
            date_of_birth = new Date(date_of_birth_year, date_of_birth_month, date_of_birth_day);
            
            person.first_name = $('input#first_name', this.view).val();
            person.middle_name = $('input#middle_name', this.view).val();
            person.last_name = $('input#last_name', this.view).val();
            person.date_of_birth = date_of_birth;
            person.save();
            
            addresses = person.addresses();
            if(addresses.length > 0) {
              addresses[0].first_line =  $('input#first_line', this.view).val();
              addresses[0].second_line = $('input#second_line', this.view).val();
              addresses[0].city = $('input#city', this.view).val();
              addresses[0].state = $('input#state', this.view).val();
              addresses[0].zip = $('input#zip', this.view).val();
              addresses[0].save();
            } else {
              address = new Address({
                first_line: $('input#first_line', this.view).val(),
                second_line: $('input#second_line', this.view).val(),
                city: $('input#city', this.view).val(),
                state: $('input#state', this.view).val(),
                zip: $('input#zip', this.view).val(),
              });
              address.setPerson(person);
              address.save();
            }
            
            phones = person.phones();
            if(phones.length > 0) {
              phones[0].number =  $('input#number', this.view).val();
              phones[0].save();
            } else {
              phone = new Phone({
                number: $('input#number', this.view).val()
              });
              phone.setPerson(person);
              phone.save();
            }
            
            emails = person.emails();
            if(emails.length > 0) {
              emails[0].address =  $('input#address', this.view).val();
              emails[0].save();
            } else {
              email = new Email({
                address: $('input#address', this.view).val()
              });
              email.setPerson(person);
              email.save();
            }
            
            customer.setPerson(person);
          }
        }        
      } else {
        person = new Person({
          first_name: $('input#first_name', this.view).val(),
          middle_name: $('input#middle_name', this.view).val(),
          last_name: $('input#last_name', this.view).val()
        });
        if(person.save()) {
          address = new Address({
            first_line: $('input#first_line', this.view).val(),
            second_line: $('input#second_line', this.view).val(),
            city: $('input#city', this.view).val(),
            state: $('input#state', this.view).val(),
            zip: $('input#zip', this.view).val(),
          });
          address.setPerson(person);
          address.save();

          phone = new Phone({
            number: $('input#number', this.view).val()
          });
          phone.setPerson(person);
          phone.save();

          email = new Email({
            address: $('input#address', this.view).val()
          });
          email.setPerson(person);
          email.save();
        }

        customer = new Customer({
          credit: parseInt(Currency.toPennies($('input#credit', this.view).val())),
          notes: $('textarea#notes', this.view).val(),
          drivers_license_number: $('input#drivers_license_number', this.view).val(),
          drivers_license_state: $('input#drivers_license_state', this.view).val(),
          active: !$('input#flagged', this.view).is(':checked')
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
    if($('input#first_name', this.view).val() == '') {
      return false;
    }
    if($('input#last_name', this.view).val() == '') {
      return false;
    }
    if($('input#number', this.view).val() == '' &&
       $('input#address', this.view).val() == '' &&
       $('input#drivers_license_number', this.view).val() == '' &&
       $('input#drivers_license_number', this.view).val() == '') {
      return false;
    }
    return true;
  },
  
  error: function() {
    $(':required', this.view).addClass('error');
  },
  
  reset: function() {
    this.callSuper();
    $('input#id', this.view).val(0);
    $('input#credit', this.view).val(Currency.format(0));
    $(':required', this.view).removeClass('error');
  }
});