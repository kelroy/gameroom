//= require "../form_controller"

var OverviewFormController = new JS.Class(FormController, {
  
  update: function(user) {
    this.reset();
    
    $('input#id', this.view).val(user.id);
    $('input#login', this.view).val(user.login);
    $('input#pin', this.view).val(user.pin);
    $('input#address', this.view).val(user.email);
    $('input#administrator', this.view).attr('checked', user.administrator);
    $('input#active', this.view).attr('checked', user.active);
    
    person = user.person();
    if(person != undefined) {
      $('input#first_name', this.view).val(person.first_name);
      $('input#last_name', this.view).val(person.last_name);
      $('input#middle_name', this.view).val(person.middle_name);
      if(person.date_of_birth != null) {
        date_of_birth = (new Date()).setISO8601(person.date_of_birth);
        $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
        $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
        $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
      }

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
      
      employee = person.employee();
      if(employee != undefined) {
        $('input#job_title', this.view).val(employee.title);
        $('input#rate', this.view).val(Currency.format(employee.rate));
      }
    }
  },
  
  save: function() {
    if(this.valid()) {
      if($('input#id', this.view).val() > 0) {
        user = User.find($('input#id', this.view).val());
        user.login = $('input#login', this.view).val();
        user.pin = $('input#pin', this.view).val();
        user.email = $('input#address', this.view).val();
        if($('input#password', this.view).val() != '') {
          user.password = $('input#password', this.view).val();
          user.password_confirmation = $('input#password_confirmation', this.view).val();
        }
        user.administrator = $('input#administrator', this.view).is(':checked');
        user.active = $('input#active', this.view).is(':checked');
        user.save();
        
        if(user != undefined) {
          person = user.person();
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
            
            employee = person.employee();
            if(employee != undefined) {
              employee.title = $('input#job_title', this.view).val();
              employee.rate = parseInt(Currency.toPennies($('input#rate', this.view).val()));
            } else {
              employee = new Employee({
                title: $('input#title', this.view).val(),
                rate: parseInt(Currency.toPennies($('input#rate', this.view).val()))
              });
              employee.setPerson(person);
              employee.save();
            }
            
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
            
            user.setPerson(person);
          }
        }        
      } else {
        date_of_birth_year = $('select#date_of_birth_year').val();
        date_of_birth_month = $('select#date_of_birth_month').val() - 1;
        date_of_birth_day = $('select#date_of_birth_day').val();
        date_of_birth = new Date(date_of_birth_year, date_of_birth_month, date_of_birth_day);
        
        person = new Person({
          first_name: $('input#first_name', this.view).val(),
          middle_name: $('input#middle_name', this.view).val(),
          last_name: $('input#last_name', this.view).val(),
          date_of_birth: date_of_birth
        });
        if(person.save()) {
          employee = new Employee({
            title: $('input#job_title', this.view).val(),
            rate: parseInt(Currency.toPennies($('input#rate', this.view).val()))
          });
          employee.setPerson(person);
          employee.save();
          
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
        }

        user = new User({
          login: $('input#login', this.view).val(),
          email: $('input#address', this.view).val(),
          password: $('input#password', this.view).val(),
          password_confirmation: $('input#password_confirmation', this.view).val(),
          pin: $('input#pin', this.view).val(),
          administrator: $('input#administrator', this.view).is(':checked'),
          active: $('input#active', this.view).is(':checked')
        });
        user.setPerson(person);
      }
      if(user.save()) {
        this.update(user);
        this.notifyObservers(user);
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
    if($('input#address', this.view).val() == '') {
      return false;
    }
    if($('input#login', this.view).val() == '') {
      return false;
    }
    if($('input#pin', this.view).val() == '') {
      return false;
    }
    if($('input#password', this.view).val() != $('input#password_confirmation', this.view).val()) {
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
    $(':required', this.view).removeClass('error');
  }
});