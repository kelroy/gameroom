var Person = new JS.Class({
  
  initialize: function(params) {
    console.log(params);
    this.id = params.id;
    this.first_name = params.first_name;
    this.middle_name = params.middle_name;
    this.last_name = params.last_name;
    this.date_of_birth = params.date_of_birth;
    this.addresses = [];
    for(address in params.addresses) {
      this.addresses.push(new Address(params.addresses[address]));
    }
    this.phones = [];
    for(phone in params.phones) {
      this.phones.push(new Phone(params.phones[phone]));
    }
    this.emails = [];
    for(email in params.emails) {
      this.emails.push(new Email(params.emails[email]));
    }
  },

  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});