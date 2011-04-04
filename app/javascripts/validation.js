var Validation = new JS.Module({
  _errors: [],
  
  valid: function() {
    this._errors = [];
    if(this.klass.validations != undefined) {
      for(column in this.klass.validations) {
        for(validation in this.klass.validations[column]) {
          if(this['_' + validation] != undefined) {
            this['_' + validation](column, this.klass.validations[column]);
          }
        }
      }
    }
    if(this._errors.length == 0) {
      return true;
    } else {
      return false;
    }
  },
  
  errors: function() {
    return this._errors;
  },
  
  _presence_of: function(column, options) {
    if(this[column] != null && this[column] != undefined && this[column] != '') {
      return true;
    } else {
      this._errors.push({
        column: column,
        type: 'presence_of',
        message: column + ' must not be empty.'
      });
      return false;
    }
  }
});