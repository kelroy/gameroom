//= require "../form_controller"

var EmployeesOverviewFormController = new JS.Class(FormController, {
  
  update: function(employee) {
    this.reset();
    
    $('input#id', this.view).val(employee.id);
    $('input#token', this.view).val(employee.token);
    $('input#password', this.view).val(employee.password);
    $('input#administrator', this.view).attr('checked', employee.administrator);
    $('input#active', this.view).attr('checked', employee.active);
    $('input#title', this.view).val(employee.title);
    $('input#rate', this.view).val(Currency.format(employee.rate));
    
    person = employee.person();
    if(person != undefined) {
      $('input#first_name', this.view).val(person.first_name);
      $('input#last_name', this.view).val(person.last_name);
      $('input#middle_name', this.view).val(person.middle_name);
      if(person.date_of_birth != null) {
        date_of_birth = (new Date()).setISO8601(person.date_of_birth);
        $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
        $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
        $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
      } else {
        date_of_birth = new Date();
        $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
        $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
        $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
      }

      addresses = person.addresses;
      if(addresses.length > 0) {
        $('input#address', this.view).val(addresses[0]);
      }
      emails = person.emails;
      if(emails.length > 0){
        $('input#email', this.view).val(emails[0]);
      }
      phones = person.phones;
      if(phones.length > 0){
        $('input#phone', this.view).val(phones[0]);
      }
    }
  },
  
  save: function() {
    if(this.valid()) {
      if($('input#id', this.view).val() > 0) {
        employee = Employee.find($('input#id', this.view).val());
        employee.token = $('input#token', this.view).val();
        employee.title = $('input#title', this.view).val();
        employee.rate = parseInt(Currency.toPennies($('input#rate', this.view).val()));
        if($('input#password', this.view).val() != '') {
          employee.password = $('input#password', this.view).val();
          employee.password_confirmation = $('input#password_confirmation', this.view).val();
        }
        employee.administrator = $('input#administrator', this.view).is(':checked');
        employee.active = $('input#active', this.view).is(':checked');
        employee.save();
        
        if(employee != undefined) {
          person = employee.person();
          if(person != undefined) {
            date_of_birth_year = $('select#date_of_birth_year', this.view).val();
            date_of_birth_month = $('select#date_of_birth_month', this.view).val() - 1;
            date_of_birth_day = $('select#date_of_birth_day', this.view).val();
            date_of_birth = new Date(date_of_birth_year, date_of_birth_month, date_of_birth_day);
            
            person.first_name = $('input#first_name', this.view).val();
            person.middle_name = $('input#middle_name', this.view).val();
            person.last_name = $('input#last_name', this.view).val();
            person.date_of_birth = date_of_birth;
            person.addresses = [$('input#address', this.view).val()];
            person.phones = [$('input#phone', this.view).val()];
            person.emails = [$('input#email', this.view).val()];
            person.save();
          }
        }
      } else {
        date_of_birth_year = $('select#date_of_birth_year', this.view).val();
        date_of_birth_month = $('select#date_of_birth_month', this.view).val() - 1;
        date_of_birth_day = $('select#date_of_birth_day', this.view).val();
        date_of_birth = new Date(date_of_birth_year, date_of_birth_month, date_of_birth_day);
        
        person = new Person({
          first_name: $('input#first_name', this.view).val(),
          middle_name: $('input#middle_name', this.view).val(),
          last_name: $('input#last_name', this.view).val(),
          addresses: [$('input#address', this.view).val()],
          phones: [$('input#phone', this.view).val()],
          emails: [$('input#email', this.view).val()],
          date_of_birth: date_of_birth
        });
        person.save();

        employee = new Employee({
          token: $('input#token', this.view).val(),
          password: $('input#password', this.view).val(),
          password_confirmation: $('input#password_confirmation', this.view).val(),
          title: $('input#title', this.view).val(),
          rate: parseInt(Currency.toPennies($('input#rate', this.view).val())),
          administrator: $('input#administrator', this.view).is(':checked'),
          active: $('input#active', this.view).is(':checked')
        });
        employee.setPerson(person);
      }
      if(employee.save()) {
        this.notifyObservers();
        this.reset();
      }
    } else {
      this.error();
    }
  },
  
  valid: function() {
    if($('input#id', this.view).val() == 0) {
      if($('input#password', this.view).val() == '') {
        $('input#password', this.view).addClass('error');
        $('input#password_confirmation', this.view).addClass('error');
        return false;
      }
      if($('input#password', this.view).val() != $('input#password_confirmation', this.view).val()) {
        $('input#password', this.view).addClass('error');
        $('input#password_confirmation', this.view).addClass('error');
        return false;
      }
    }
    if($('input#first_name', this.view).val() == '') {
      return false;
    }
    if($('input#last_name', this.view).val() == '') {
      return false;
    }
    if($('input#address', this.view).val() == '') {
      return false;
    }
    if($('input#phone', this.view).val() == '') {
      return false;
    }
    if($('input#email', this.view).val() == '') {
      return false;
    }
    if($('input#token', this.view).val() == '') {
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
    $('input#password', this.view).removeClass('error');
    $('input#password_confirmation', this.view).removeClass('error');
    $(':required', this.view).removeClass('error');
    date_of_birth = new Date();
    $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
    $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
    $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
    $('input#administrator', this.view).attr('checked', false);
    $('input#active', this.view).attr('checked', true);
  }
});