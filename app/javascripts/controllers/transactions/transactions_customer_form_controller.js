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
    $('input#flagged', this.view).attr('checked', !customer.active);
    $('textarea#notes', this.view).val(customer.notes);
    
    person = customer.person();
    if(person != undefined) {
      $('input#first_name', this.view).val(person.first_name);
      $('input#middle_name', this.view).val(person.middle_name);
      $('input#last_name', this.view).val(person.last_name);
      $('input#drivers_license', this.view).val(person.drivers_license);
      if(person.date_of_birth == null || person.date_of_birth == undefined) {
        person.date_of_birth = new Date();
      }
      date_of_birth = (new Date()).setISO8601(person.date_of_birth);
      $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
      $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
      $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
      
      addresses = person.addresses;
      if(addresses.length > 0) {
        $('input#address', this.view).val(addresses[0]);
      }

      phones = person.phones;
      if(phones.length > 0){
        $('input#phone', this.view).val(phones[0]);
      }

      emails = person.emails;
      if(emails.length > 0){
        $('input#email', this.view).val(emails[0]);
      }
    }
  },
  
  save: function() {
    if(this.valid()) {
      if($('input#id', this.view).val() > 0) {
        customer = Customer.find($('input#id', this.view).val());
        customer.credit = parseInt(Currency.toPennies($('input#credit', this.view).val()));
        customer.notes = $('textarea#notes', this.view).val();
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
            person.drivers_license = $('input#drivers_license', this.view).val();
            person.date_of_birth = date_of_birth;
            
            addresses = person.addresses;
            if(addresses.length > 0) {
              addresses[0].address =  $('input#address', this.view).val();
            } else {
              person.addresses = [$('input#address', this.view).val()];
            }
            phones = person.phones;
            if(phones.length > 0) {
              phones[0] =  $('input#phone', this.view).val();
            } else {
              person.phones = [$('input#phone', this.view).val()];
            }
            emails = person.emails;
            if(emails.length > 0) {
              emails[0] =  $('input#email', this.view).val();
            } else {
              person.emails = [$('input#email', this.view).val()];
            }
            
            person.save();
            customer.setPerson(person);
          }
        }        
      } else {
        person = new Person({
          first_name: $('input#first_name', this.view).val(),
          middle_name: $('input#middle_name', this.view).val(),
          last_name: $('input#last_name', this.view).val(),
          drivers_license: $('input#drivers_license', this.view).val(),
          addresses: [$('input#address', this.view).val()],
          phones: [$('input#phone', this.view).val()],
          emails: [$('input#email', this.view).val()]
        });
        person.save();
        
        customer = new Customer({
          credit: parseInt(Currency.toPennies($('input#credit', this.view).val())),
          notes: $('textarea#notes', this.view).val(),
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