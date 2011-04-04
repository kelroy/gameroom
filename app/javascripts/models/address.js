//= require "../model"
//= require "person"

var Address = new JS.Class(Model, {
  extend: {
    resource: 'address',
    columns: ['id', 'person_id', 'first_line', 'second_line', 'city', 'state', 'country', 'zip'],
    belongs_to: ['person'],
    validations: {
      'first_line': {
        'presence_of': {}
      },
      'city': {
        'presence_of': {}
      },
      'state': {
        'presence_of': {}
      },
      'zip': {
        'presence_of': {}
      }
    }
  }
});