//= require "../model"
//= require "person"

var Email = new JS.Class(Model, {
  extend: {
    resource: 'email',
    columns: ['id', 'person_id', 'address'],
    belongs_to: ['person'],
    validations: {
      'address': {
        'presence_of': {}
      }
    },
  }
});