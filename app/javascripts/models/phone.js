//= require "../model"
//= require "person"

var Phone = new JS.Class(Model, {
  extend: {
    resource: 'phone',
    columns: ['id', 'person_id', 'title', 'number'],
    belongs_to: ['person'],
    'number': {
      'presence_of': {}
    }
  }
});