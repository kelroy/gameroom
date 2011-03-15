var Person = new JS.Class({
  
  initialize: function(params) {
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
    if(this.first_name == '' || this.first_name == undefined || this.first_name == null) {
      return false;
    }
    if(this.last_name == '' || this.last_name == undefined || this.last_name == null) {
      return false;
    }
    for(address in this.addresses) {
      if(!this.addresses[address].valid()) {
        return false;
      }
    }
    for(phone in this.phones) {
      if(!this.phones[phone].valid()) {
        return false;
      }
    }
    for(email in this.emails) {
      if(!this.emails[email].valid()) {
        return false;
      }
    }
    return true;
  }
});