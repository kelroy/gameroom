var Employee = new JS.Class({
  extend: {
    find: function(id) {
      employee = undefined;
      $.ajax({
        url: '/api/employees/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          employee = new Employee({
            id: results.employee.id,
            credit: results.customer.credit,
            drivers_license_number: results.customer.drivers_license_number,
            drivers_license_state: results.customer.drivers_license_state,
            notes: results.customer.notes,
            active: results.customer.active
          });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x'
      });
      return employee;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.rate = params.rate;
    this.active = params.active;
  },

  save: function() {

  },
  
  valid: function() {
    return true;
  }
});